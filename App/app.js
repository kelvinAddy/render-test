const express = require('express');
const middleware = require('./Middlewares/middleware');
const notesRouter = require('./Routes/notesRouter');
const connectToDb = require('./utils/db');

const app = express();

connectToDb();

app.use(express.static('dist'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/notes', notesRouter);

app.use(middleware.unKnownEndpoint);
app.use(middleware.handleError);

module.exports = app;
