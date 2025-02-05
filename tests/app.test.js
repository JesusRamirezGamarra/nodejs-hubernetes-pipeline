const request = require('supertest');
const app = require('../index');


beforeAll(() => {
    server = app.listen(3000);
});

afterAll(() => {
    server.close();
})


describe('GET /api/hello', () => {
    it('deberia retornar un json mensaje de hola mundo', async () => {
        const response = await request(app).get('/api/hello');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Hola mundo!');
    })
})

describe('GET /api/message', () => {
    it('deberia retornar un mensaje', async () => {
        const response = await request(app).get('/api/message');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Endpoint de message!');
    })
})