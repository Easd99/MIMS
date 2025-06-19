import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaClient } from '@prisma/client';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let order: any;
  let token: string;
  let userId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = new PrismaClient();

    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();

    const userCredentials = {
      name: 'Test Auth User',
      email: 'testuser@example.com',
      password: '123456',
    };

    const createdUser = await request('http://localhost:5000/api/v1')
      .post('/auth/signup')
      .send(userCredentials);

    const loginRes = await request('http://localhost:5000/api/v1')
      .post('/auth/login')
      .send({
        email: userCredentials.email,
        password: userCredentials.password,
      });

    token = loginRes.body.access_token;
    userId = createdUser.body.id;
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
    await request('http://localhost:5000/api/v1').delete(`/users/${userId}`);
  });

  describe('POST /orders', () => {
    const newOrder = {
      status: 'pending',
      items: [
        {
          productId: 2,
          quantity: 1,
        },
      ],
    };
    it('should create a new order', async () => {
      const res = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(newOrder);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.status).toBe('pending');
      expect(res.body.items.length).toBe(1);

      order = res.body;
    });
    it('should return error if product does not exist', async () => {
      const res = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'pending',
          items: [{ productId: 9999, quantity: 1 }],
        });

      expect(res.status).toBe(404);
    });
  });

  describe('GET /orders', () => {
    it('should return all orders', async () => {
      const res = await request(app.getHttpServer())
        .get('/orders')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /orders/:id', () => {
    it('should return a specific order by ID', async () => {
      const res = await request(app.getHttpServer())
        .get(`/orders/${order.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(order.id);
    });
    it('should return 404 if order not found', async () => {
      const res = await request(app.getHttpServer())
        .get(`/orders/99999`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /orders/:id', () => {
    it('should update order status', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/orders/${order.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'completed' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('completed');
    });
    it('should return 404 if order not found', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/orders/99999`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'completed' });

      expect(res.status).toBe(404);
    });
  });

  describe('POST /orders/:id/change-status', () => {
    it('should change order status', async () => {
      const res = await request(app.getHttpServer())
        .post(`/orders/${order.id}/change-status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'in process' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('in process');
    });
    it('should return 404 if order not found', async () => {
      const res = await request(app.getHttpServer())
        .post(`/orders/99999/change-status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'in process' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /orders/:id', () => {
    it('should return 404 if order not found', async () => {
      const res = await request(app.getHttpServer())
        .delete('/orders/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('should delete the order', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/orders/${order.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(204);
    });
  });
});
