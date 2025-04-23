import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hashSync } from 'bcryptjs';
import { Express } from 'express';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';


interface OAuthResponse {
  access_token: string;
}

describe('AuthenticateController (e2e)', () => {
  let app: INestApplication<Express>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /oauth', async () => {

    await prisma.user.create({
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
    
    const response = await request(app.getHttpServer()).post('/oauth').send({
      username: 'marcio.soares@essentia.com.br',
      password: 'Abc123456'
    });
    expect(response.status).toBe(201);
    // expect(response.body).toEqual({
    //   access_token: expect.any(String)
    // });
    const responseBody = response.body as OAuthResponse;
    expect(responseBody.access_token).toBeDefined();
    expect(typeof responseBody.access_token).toBe('string');

  });

});