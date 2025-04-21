import { Body, ConflictException, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { hashSync } from 'bcryptjs';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

const _createAccountBodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  birth_date: z
    .string()
    .refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
      message: 'birth_date must be in the format YYYY-MM-DD'
    })
    .refine((date) => !isNaN(new Date(date).getTime()), {
      message: 'birth_date must be a valid date'
    }),
  gender: z.enum(['m', 'f'])
});

type CreateAccountBodySchema = z.infer<typeof _createAccountBodySchema>;

@Controller('account-create')
export class CreateAccountController {

  constructor(
    private prisma: PrismaService
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(_createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema): Promise<void> {

    const { email, password } = body;

    const userWithSameEmail = await this.prisma.user.findFirst({
      where: {
        username: email,
        deletedAt: null, 
        OR: [
          { sourceSystem: 1 },
          { sourceSystem: null }
        ]
      }
    });

    if (userWithSameEmail) {
      throw new ConflictException('User with same e-mail address already exists');
    }

    const hashedPassword = hashSync(password);

  }

}