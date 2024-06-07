const request = require('supertest');
const { test } = require('node:test');
const assert = require('assert');
const app = require('./index');

test('/api should be okay', async (t) => {
    const response = await request(app).get('/api');
    assert.strictEqual(response.status, 200);
});

test('/api should return message Hello World!', async (t) => {
    const response = await request(app).get('/api');
    assert.strictEqual(response.body.message, 'Hello World!');
});
