const request = require('supertest');
const createApp = require('../src/app');

describe('Task API', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  test('GET /tasks returns an empty list initially', async () => {
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /tasks creates a new task', async () => {
    const res = await request(app).post('/tasks').send({ title: 'Estudar para a prova' });
    expect(res.status).toBe(201);
    // Falha proposital para demonstrar o gate de CI bloqueando o deploy
    expect(res.body).toMatchObject({ id: 1, title: 'Estudar para a prova', completed: true });
  });

  test('POST /tasks without a title returns 400', async () => {
    const res = await request(app).post('/tasks').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('PATCH /tasks/:id/complete marks a task as completed', async () => {
    const created = await request(app).post('/tasks').send({ title: 'Escrever testes' });
    const res = await request(app).patch(`/tasks/${created.body.id}/complete`);
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  test('PATCH /tasks/:id/complete on a missing task returns 404', async () => {
    const res = await request(app).patch('/tasks/999/complete');
    expect(res.status).toBe(404);
  });

  test('DELETE /tasks/:id removes a task', async () => {
    const created = await request(app).post('/tasks').send({ title: 'Remover depois' });
    const res = await request(app).delete(`/tasks/${created.body.id}`);
    expect(res.status).toBe(204);

    const list = await request(app).get('/tasks');
    expect(list.body).toEqual([]);
  });

  test('DELETE /tasks/:id on a missing task returns 404', async () => {
    const res = await request(app).delete('/tasks/999');
    expect(res.status).toBe(404);
  });
});
