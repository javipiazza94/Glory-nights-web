// tests/promo.test.js
const app = require('../src/app');   // tu instancia de Express/Next API
const request = global.request;

describe('GET /api/promoters', () => {
  it('debe devolver una lista de promotores', async () => {
    const res = await request(app).get('/api/promoters');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // Si conoces la estructura del objeto:
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('name');
    }
  });
});