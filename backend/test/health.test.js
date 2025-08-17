const request = require('supertest');
const app = require('../app');

describe('Health endpoint', () => {
  it('GET /api/health -> 200 + ok:true', async () => {
    const res = await request(app).get('/api/health');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (!res.body || res.body.ok !== true) throw new Error(`Body ${JSON.stringify(res.body)}`);
  });
});
