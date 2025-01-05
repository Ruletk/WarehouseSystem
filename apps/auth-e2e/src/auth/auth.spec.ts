import axios from 'axios';

describe('GET /health', () => {
  it('should return a health message', async () => {
    const res = await axios.get(`/health`);

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('status');
    expect(res.data.status).toBe('OK');

    expect(res.data).toHaveProperty('timestamp');
    expect(typeof res.data.timestamp).toBe('string');
  });
});
