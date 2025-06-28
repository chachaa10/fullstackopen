const blogRouter = require('express').Router();
const { BlogModel } = require('../models/blog');
const logger = require('../utils/logger');

// retrieve all blogs
blogRouter.get('/', (request, response) => {
  BlogModel.find({}).then((returnedBlogs) => {
    response.json(returnedBlogs);
  });
});

// retrieve one blog
blogRouter.get('/:id', (request, response, next) => {
  const id = request.params.id;

  BlogModel.findById(id)
    .then((returnedBlog) => {
      if (returnedBlog) {
        response.json(returnedBlog);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// create blog
blogRouter.post('/', (request, response, next) => {
  const { title, author, url } = request.body;

  if (!title) {
    return response.status(400).json({ error: 'title is required' });
  } else if (!author) {
    return response.status(400).json({ error: 'author is required' });
  } else if (!url) {
    return response.status(400).json({ error: 'url is required' });
  }

  const blog = new BlogModel({
    title,
    author,
    url,
  });

  blog
    .save()
    .then((savedBlog) => {
      logger.info(`Added blog ${savedBlog.title} by ${savedBlog.author}`);
      response.status(201).json(savedBlog);
    })
    .catch((error) => next(error));
});

// update blog
blogRouter.put('/:id', (request, response, next) => {
  const id = request.params.id;
  const { title, author, url } = request.body;

  if (!title) {
    return response.status(400).json({ error: 'title is required' });
  } else if (!author) {
    return response.status(400).json({ error: 'author is required' });
  } else if (!url) {
    return response.status(400).json({ error: 'url is required' });
  }

  const blog = {
    title,
    author,
    url,
  };

  BlogModel.findByIdAndUpdate(id, blog, { new: true })
    .then((updatedBlog) => {
      response.json(updatedBlog);
    })
    .catch((error) => next(error));
});

// delete blog
blogRouter.delete('/:id', (request, response, next) => {
  const id = request.params.id;

  BlogModel.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

module.exports = blogRouter;
