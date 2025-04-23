import { Body, Controller, Post, UnauthorizedException, UsePipes } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

const _authenticateBodySchema = z.object({
  username: z.string().email(),
  password: z.string().min(6)
});

type AuthenticateBodySchema = z.infer<typeof _authenticateBodySchema>;

@Controller('oauth')
export class AuthenticateController {

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) { }

  @Post()
  @UsePipes(new ZodValidationPipe(_authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema): Promise<any> {
    const { password, username } = body;

    const user = await this.prisma.user.findFirst({
      where: {
        username,
        deletedAt: null,
        OR: [
          { sourceSystem: 1 },
          { sourceSystem: null }
        ]
      }
    });

    if (!user) {
      throw new UnauthorizedException('User credentials do not match');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials do not match');
    }

    const accessToken = this.jwt.sign({ sub: user.id });

    return {
      access_token: accessToken
    };
  }

}