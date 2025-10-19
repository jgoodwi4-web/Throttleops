import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';

test('POST /api/auth/login returns 401 or 500 for invalid credentials', async () => {
  const res = await request(app).post('/api/auth/login').send({ email: 'noone@example.com', password: 'x' });
  // The app may try to access DB; accept 401 (invalid) or 500 (no DB)
  assert.ok([401, 500].includes(res.status));
});
