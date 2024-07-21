import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');


describe('Session Router', () => {
    let testUserMail;

    before(async () => {
        testUserMail = "fesfewfewfew@gmail.com";
    });
    it('should register a new user', async () => {
        const response = await requester
            .post('/api/sessions/register')
            .send({
                first_name: 'Alice',
                last_name: 'Smith',
                email: 'alice.smith@gmail.com',
                age: 25,
                password: 'td1234',
            });

        expect(response.status).to.equal(200);

    });

    it('should login a user', async () => {
        const response = await requester
            .post('/api/sessions/login')
            .send({
                email: testUserMail,
                password: '1234',
            });

        expect(response.status).to.equal(200);
    });

    it('should send a password reset email', async () => {
        const response = await requester
            .post(`/api/sessions/send-recover-mail/${testUserMail}`)


        expect(response.status).to.equal(200);

    });
});