const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
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
  }

  next(error);
};

module.exports = {
  unknownEndpoint,
  errorHandler,
};
