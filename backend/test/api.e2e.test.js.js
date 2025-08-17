// backend/test/api.e2e.test.js
const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;
let app;
let token;
let createdInternId;
let createdTaskId;

before(async function () {
  this.timeout(60000); // allow time to download Mongo binary first run

  // Start in-memory Mongo and set env BEFORE connecting
  mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
  process.env.NODE_ENV = 'test';

  const connectDB = require('../config/db');
  await connectDB();

  app = require('../app');
});

after(async () => {
  await mongoose.connection?.dropDatabase();
  await mongoose.connection?.close();
  if (mongod) await mongod.stop();
});

describe('RIM API (E2E)', () => {
  it('GET /api/health -> 200', async () => {
    const res = await request(app).get('/api/health');
    if (res.statusCode !== 200) throw new Error('Health failed');
  });

  it('Register user -> 201 + token', async () => {
    const res = await request(app).post('/api/users/register').send({
      name: 'Test Admin',
      email: 'admin@test.com',
      password: '123456',
      role: 'admin',
    });
    if (!res.body.token) throw new Error('No token on register');
  });

  it('Login user -> 200 + token', async () => {
    const res = await request(app).post('/api/users/login').send({
      email: 'admin@test.com',
      password: '123456',
    });
    if (!res.body.token) throw new Error('No token on login');
    token = res.body.token;
  });

  it('Create intern -> 201', async () => {
    const res = await request(app)
      .post('/api/interns')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Alice Intern',
        email: 'alice@example.com',
        department: 'Engineering',
        startDate: '2025-01-01',
        status: 'active',
      });
    createdInternId = res.body._id;
    if (!createdInternId) throw new Error('No intern id');
  });

  it('List interns -> 200', async () => {
    const res = await request(app)
      .get('/api/interns')
      .set('Authorization', `Bearer ${token}`);
    if (!Array.isArray(res.body)) throw new Error('Interns not array');
  });

  it('Update intern -> 200', async () => {
    const res = await request(app)
      .put(`/api/interns/${createdInternId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ department: 'QA' });
    if (res.body.department !== 'QA') throw new Error('Intern not updated');
  });

  it('Create task -> 201', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Build Feature X',
        description: 'Do something important',
        deadline: '2025-08-30',
        status: 'Pending',
        intern: createdInternId,
      });
    createdTaskId = res.body._id;
    if (!createdTaskId) throw new Error('No task id');
  });

  it('List tasks -> 200', async () => {
    const res = await request(app)
      .get(`/api/tasks?internId=${createdInternId}`)
      .set('Authorization', `Bearer ${token}`);
    if (!Array.isArray(res.body)) throw new Error('Tasks not array');
  });

  it('Mark attendance -> 201', async () => {
    const res = await request(app)
      .post('/api/attendance')
      .set('Authorization', `Bearer ${token}`)
      .send({
        intern: createdInternId,
        date: '2025-08-15',
        status: 'Present',
      });
    if (res.body.status !== 'Present') throw new Error('Attendance failed');
  });

  it('Submit evaluation -> 201', async () => {
    const res = await request(app)
      .post('/api/evaluations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        intern: createdInternId,
        criteria: 'Communication',
        score: 8,
        comments: 'Good progress',
      });
    if (res.body.score !== 8) throw new Error('Evaluation failed');
  });

  it('Protected without token -> 401/403', async () => {
    const res = await request(app).get('/api/interns');
    if (![401, 403].includes(res.statusCode)) {
      throw new Error('Should require auth');
    }
  });
});
