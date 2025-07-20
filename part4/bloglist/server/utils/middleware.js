const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');

  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '');
  } else {
    request.token = null;
  }

  next();
};

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    request.user = null;
    return next();
  }

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);

    if (!decodedToken.id) {
      return response.status(404).json({ error: 'token invalid' });
    }

    request.decodedToken = decodedToken;

    const user = await User.findById(decodedToken.id);

    if (!user) {
      return response.status(400).json({ error: 'UserId missing or invalid' });
    }

    request.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const errorHandler = (error, request, response, next) => {
  console.error(error);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    const extractedErrors = {};

    const validationErrors = error.errors;

    if (validationErrors && typeof validationErrors === 'object') {
      for (const fieldName of Object.keys(validationErrors)) {
        const errorDetails = validationErrors[fieldName];

        if (!errorDetails || !errorDetails.message || !errorDetails.value) {
          continue;
        }

        extractedErrors[fieldName] = {
          message: errorDetails.message,
          value: errorDetails.value,
        };
      }
    }

    return response.status(400).json({ error: extractedErrors });
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    return response
      .status(400)
      .json({ error: 'expected `username` to be unique' });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token missing or invalid' });
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' });
  }

  next(error);
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
