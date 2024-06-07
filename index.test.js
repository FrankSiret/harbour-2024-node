const request = require('request');

describe('Test /api', () => {

    const url = 'http://localhost:3000/api';
    
    it('should be okay', () => {
        request(url, function (error, response, body) {
            (async () => {
                const chai = await import('chai');
                const { expect } = chai;
                expect(response.statusCode).to.equal(200);
            })();
        });
    });

    it('should return message Hello Wordl!', () => {
        request(url, function (error, response, body) {
            (async () => {
                const chai = await import('chai');
                const { expect } = chai;
                expect(body['message']).to.equal('Hello World!');
            })();
        });
    });

});
