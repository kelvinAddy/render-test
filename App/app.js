const express = require('express');
const middleware = require('./Middlewares/middleware');
const notesRouter = require('./Routes/notesRouter');
const userRouter = require('./Routes/userRouter');
const loginRouter = require('./Routes/loginRouter');
const connectToDb = require('./utils/db');
const config = require('./utils/config');

const app = express();

app.set('port', config.PORT);

app.use(express.static('dist'));
app.use(express.json());
app.use(middleware.tokenExtractor);
app.use(middleware.requestLogger);

app.use('/api/notes', notesRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

app.use(middleware.unKnownEndpoint);
app.use(middleware.handleError);

process.env.NODE_ENV === 'test' &&
  connectToDb().then(() => console.log('Connected to MongoDB'));

module.exports = app;
