const assert = require('assert');
const rq = require('request-promise-native');
const server = require('../server');

const LOCALHOST_PORT = 3000;

describe('Server requests', () => {
    let app;

    before(done => {
        app = server.listen(LOCALHOST_PORT, done);
    });

    after(done => {
        app.close(done);
    });

    describe('/GET', () => {
        it('/GET / should return index.html', async () => {
            const response = await rq(`http://localhost:${LOCALHOST_PORT}`, { resolveWithFullResponse: true });
            assert(response.headers['content-type'], 'text/html');
        });

        it('/GET /index.html should return index.html', async () => {
            const response = await rq(`http://localhost:${LOCALHOST_PORT}/index.html`, { resolveWithFullResponse: true });
            assert(response.headers['content-type'], 'text/html');
        });
    });

});