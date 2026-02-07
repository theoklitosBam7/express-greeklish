import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '@/app';

const describeIntegration = process.env.CODEX_SANDBOX ? describe.skip : describe;

describeIntegration('API Integration', () => {
  it('GET /api/greeklish remains backward compatible', async () => {
    const app = createApp();

    const response = await request(app).get('/api/greeklish').query({ text: 'Euhxo: autw pou akougetai wrea.' });

    expect(response.status).toBe(200);
    expect(typeof response.headers['x-request-id']).toBe('string');
    expect(typeof response.body.greek).toBe('string');
    expect(response.body.greek).toBe('Εύηχο: αυτό που ακούγεται ωραία.');
  });

  it('POST /api/v1/convert returns the detailed v1 schema', async () => {
    const app = createApp();

    const response = await request(app).post('/api/v1/convert').send({
      text: 'Euhxo: autw pou akougetai wrea.',
    });

    expect(response.status).toBe(200);
    expect(response.body.input).toBe('Euhxo: autw pou akougetai wrea.');
    expect(typeof response.body.output).toBe('string');
    expect(Array.isArray(response.body.tokens)).toBe(true);
    expect(Array.isArray(response.body.warnings)).toBe(true);
    expect(typeof response.body.meta.requestId).toBe('string');
    expect(typeof response.body.meta.elapsedMs).toBe('number');
  });

  it('POST /api/v1/convert validates missing and too-long text', async () => {
    const app = createApp();

    const missingResponse = await request(app).post('/api/v1/convert').send({});
    expect(missingResponse.status).toBe(400);
    expect(missingResponse.body.error.code).toBe('BAD_REQUEST');
    expect(typeof missingResponse.body.error.requestId).toBe('string');

    const tooLongResponse = await request(app)
      .post('/api/v1/convert')
      .send({ text: 'a'.repeat(5001) });
    expect(tooLongResponse.status).toBe(422);
    expect(tooLongResponse.body.error.code).toBe('UNPROCESSABLE');
  });

  it('health and readiness endpoints expose service status', async () => {
    const app = createApp();

    const healthz = await request(app).get('/healthz');
    expect(healthz.status).toBe(200);
    expect(healthz.body).toEqual({ status: 'ok' });

    const readyz = await request(app).get('/readyz');
    expect(readyz.status).toBe(200);
    expect(readyz.body.status).toBe('ready');
    expect(typeof readyz.body.dictionaryLoadCount).toBe('number');
  });
});
