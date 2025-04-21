import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('test')
@UseGuards(JwtAuthGuard)
export class TestController {

  constructor() { }

  @Get()
  handle(): any {
    return {
      message: 'Hello World'
    };
  }
}