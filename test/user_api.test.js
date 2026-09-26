const User = require('../App/Models/user');
const helper = require('./test_helper');
const app = require('../App/app');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { after, test, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const api = supertest(app);

describe('when one user exists in the db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('Xerus', 10);
    const user = await User.create({
      username: 'xerus',
      passwordHash: passwordHash,
    });
  });

  test('succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'Jonas',
      name: 'Kelvin Addy',
      password: 'Xerus is Kelvin',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const userNames = usersAtEnd.map(({ username }) => username);
    assert(userNames.includes(newUser.username.toLocaleLowerCase()));
  });

  test('fails with error 400 when username already exists', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'XeRuS',
      name: 'Dexter Xerus',
      password: 'kINGkEV',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes('username must be unique'));
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
