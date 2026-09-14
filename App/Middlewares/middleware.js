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
    res.status(500).json({ error: 'Malformatted id' });
  else if (err.name === 'ValidationError')
    res.status(400).json({ error: err.message });

  next(err);
};

module.exports = { requestLogger, unKnownEndpoint, handleError };
