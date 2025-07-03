const blogRouter = require('express').Router();
const { BlogModel } = require('../models/blog');

// retrieve all blogs
blogRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await BlogModel.find({});
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

// retrieve one blog
blogRouter.get('/:id', async (request, response, next) => {
  const id = request.params.id;

  try {
    const blog = await BlogModel.findById(id);

    if (!blog) {
      return response.status(404).json({ error: 'blog not found' });
    }

    response.json(blog);
  } catch (error) {
    next(error);
  }
});

// create blog
blogRouter.post('/', async (request, response, next) => {
  const { title, author, url, likes } = request.body;

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
    likes: likes || 0,
  });

  try {
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

// update blog
blogRouter.put('/:id', async (request, response, next) => {
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

  const id = request.params.id;
  try {
    const updatedBlog = await BlogModel.findById(id);

    if (!updatedBlog) {
      return response.status(404).json({ error: 'blog not found' });
    }

    updatedBlog.set(blog);
    const savedBlog = await updatedBlog.save();
    response.json(savedBlog);
  } catch (error) {
    next(error);
  }
});

// delete blog
blogRouter.delete('/:id', async (request, response, next) => {
  const id = request.params.id;

  try {
    const blog = await BlogModel.findById(id);

    if (!blog) {
      return response.status(404).json({ error: 'blog not found' });
    }

    await blog.deleteOne();
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = blogRouter;
