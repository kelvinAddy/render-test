const express = require('express');
const middleware = require('./Middlewares/middleware');
const notesRouter = require('./Routes/notesRouter');
const userRouter = require('./Routes/userRouter');
const loginRouter = require('./Routes/loginRouter');
const connectToDb = require('./utils/db');

const app = express();

connectToDb();

app.use(express.static('dist'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/notes', notesRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

app.use(middleware.unKnownEndpoint);
app.use(middleware.handleError);

module.exports = app;
