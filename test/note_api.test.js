const { test, after, beforeEach } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../App/app');
const assert = require('node:assert');
const helper = require('./test_helper');
const api = supertest(app);
const Note = require('../App/Models/note');

beforeEach(async () => {
  await Note.deleteMany({});
  await Note.insertMany(helper.initialNotes);
});

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all notes are returned', async () => {
  const res = await api.get('/api/notes');
  assert.strictEqual(res.body.length, helper.initialNotes.length);
});

test('a specific note is within the returned notes', async () => {
  const res = await api.get('/api/notes');

  const contents = res.body.map((e) => e.content);
  assert(contents.includes('HTML is easy'));
});

test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  };

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const notesAtEnd = await helper.notesInDb();
  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1);

  const contents = notesAtEnd.map((n) => n.content);
  assert(contents.includes('async/await simplifies making async calls'));
});

test('note without content is not added', async () => {
  const newNote = {
    important: true,
  };

  await api.post('/api/notes').send(newNote).expect(400);

  const notesAtEnd = await helper.notesInDb();

  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length);
});

test('A specific note can be viewed', async () => {
  const noteAtStart = await helper.notesInDb();
  const noteToView = noteAtStart[0];

  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  assert.deepStrictEqual(resultNote.body, noteToView);
});

test('a note can be deleted', async () => {
  const notesAtStart = await helper.notesInDb();
  const noteToDelete = notesAtStart[0];

  await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

  const notesAtEnd = await helper.notesInDb();

  const ids = notesAtEnd.map(({ id }) => id);
  assert(!ids.includes(noteToDelete.id));
  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1);
});

// test.only('a specific note can have its keys changed', async () => {
//   const noteAtStart = await helper.notesInDb();
//   const noteToEdit = {
//     content: noteAtStart[0].content,
//     important: !noteAtStart[0].important,
//   };

//   await api
//     .put(`/api/notes/${noteAtStart[0].id}`)
//     .send(noteToEdit)
//     .expect(200)
//     .expect('Content-Type', /application\/json/);

//   const modifiedNote = (await helper.notesInDb()).find(
//     ({ id }) => id === noteToEdit.id,
//   );
//   assert.deepStrictEqual(modifiedNote, noteToEdit);
// });

after(async () => {
  await mongoose.connection.close();
});
