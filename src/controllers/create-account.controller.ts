import { Body, ConflictException, Controller, HttpCode, Post } from '@nestjs/common';
import { hashSync } from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('account-create')
export class CreateAccountController {

  constructor(
    private prisma: PrismaService
  ) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: any): Promise<void> {

    const { name, email, password } = body;

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