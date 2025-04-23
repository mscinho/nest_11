import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { hashSync } from 'bcryptjs';
import { Express } from 'express';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';


interface TestResponse {
  message: string;
  user: {
    sub: number;
  };
}

describe('TestController (e2e)', () => {
  let app: INestApplication<Express>;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /test', async () => {

    const user = await prisma.user.create({
      data: {
        username: 'marcio.soares@essentia.com.br',
        password: hashSync('Abc123456'),
        person: {
          create: {
            name: 'Márcio Soares',
            email: 'marcio.soares@essentia.com.br',
            gender: 'm',
            birth_date: new Date('1984-02-22')
          }
        }
      }
    });

    const accessToken = jwt.sign({ sub: user.id });
    
    const response = await request(app.getHttpServer()).get('/test')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);

    const responseBody = response.body as TestResponse;
    expect(responseBody).toEqual({
      ...responseBody
    });

  });

});