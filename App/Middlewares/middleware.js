const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');
const User = require('../Models/user');

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method);
  logger.info('Path: ', req.path);
  logger.info('Body: ', req.body);
  logger.info('---');
  next();
};

const tokenExtractor = (req, res, next) => {
  req.token = null;
  const authorization = req.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '');
  }

  next();
};

const userExtractor = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);

  if (!decodedToken.id)
    return res.status(401).json({ error: 'Token is invalid' });

  const user = await User.findById(decodedToken.id);
  req.user = user;

  next();
};

const unKnownEndpoint = (req, res) => {
  res.status(400).json({ error: 'Unknown Endpoint' });
};

const handleError = (error, req, res, next) => {
  switch (true) {
    case error.name === 'CastError':
      return res.status(400).json({ error: 'Malformed id' });

    case error.name === 'ValidationError':
      return res.status(400).json({ error: error.message });

    case error.name === 'MongoServerError' &&
      error.message.includes('E11000 duplicate key error'):
      res.status(400).json({ error: 'username must be unique' });

    case error.name === 'JsonWebTokenError':
      return res.status(401).json({ error: 'token is missing or invalid' });

    case error.name === 'TokenExpiredError':
      return res.status(401).json({ error: 'token expired' });

    default:
      next(error);
  }
};

module.exports = {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unKnownEndpoint,
  handleError,
};
