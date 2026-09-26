const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method);
  logger.info('Path: ', req.path);
  logger.info('Body: ', req.body);
  logger.info('---');
  next();
};

const unKnownEndpoint = (req, res) => {
  res.status(400).json({ error: 'Unknown Endpoint' });
};

const handleError = (err, req, res, next) => {
  if (err.name === 'CastError')
    return res.status(400).json({ error: 'Malformatted id' });
  else if (err.name === 'ValidationError')
    return res.status(400).json({ error: err.message });
  else if (
    err.name === 'MongoServerError' &&
    err.message.includes('E11000 duplicate key error')
  ) {
    return res.status(400).json({ error: 'username must be unique' });
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'token is missing or invalid' });
  } else if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' });
  }

  next(err);
};

module.exports = { requestLogger, unKnownEndpoint, handleError };
