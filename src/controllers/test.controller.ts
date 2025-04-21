import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserPayload } from 'src/auth/jwt.strategy';


@Controller('test')
@UseGuards(JwtAuthGuard)
export class TestController {

  constructor() { }

  @Get()
  handle(@CurrentUser() user: UserPayload): any {
    return {
      message: 'Hello World',
      user
    };
  }
}