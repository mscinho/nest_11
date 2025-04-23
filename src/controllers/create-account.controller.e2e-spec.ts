import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Express } from 'express';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';

describe('CreateAccountController (e2e)', () => {
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

  test('[POST] /create-account', async () => {
    
    const response = await request(app.getHttpServer()).post('/account-create').send({
      email: 'marcio.soares@essentia.com.br',
      password: 'Abc123456',
      name: 'Márcio Soares',
      birth_date: '1984-02-22',
      gender: 'm'
    });
    expect(response.status).toBe(201);

    const userOnDatebase = await prisma.user.findFirst({
      where: {
        username: 'marcio.soares@essentia.com.br',
        deletedAt: null, 
        OR: [
          { sourceSystem: 1 },
          { sourceSystem: null }
        ]
      }
    });
    expect(userOnDatebase).toBeTruthy();

  });

});