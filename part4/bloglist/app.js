const mongoose = require('mongoose');
const { MONGODB_URI } = require('./utils/config');
const logger = require('./utils/logger');
const express = require('express');
const blogRouter = require('./controllers/blogs');
const middleware = require('./utils/middleware');

const app = express();

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

// middleware
app.use(express.static('dist'));
app.use(express.json());

// routes
app.use('/api/blogs', blogRouter);

// error handlers
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
