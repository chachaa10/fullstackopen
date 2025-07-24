const blogsRouter = require('express').Router();
const { Blog } = require('../models/blog');

// retrieve all blogs
blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', {
      username: 1,
      name: 1,
    });

    if (!blogs) {
      return response.status(404).json({ error: 'blogs not found' });
    }

    response.status(200).json(blogs);
  } catch (error) {
    next(error);
  }
});

// retrieve one blog
blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id).populate('user', {
      username: 1,
      name: 1,
    });

    if (!blog) {
      return response.status(404).json({ error: 'blog not found' });
    }

    response.status(200).json(blog);
  } catch (error) {
    next(error);
  }
});

// create a blog
blogsRouter.post('/', async (request, response, next) => {
  const { title, author, url } = request.body;

  const blogErrorMessage = {};

  if (!title) {
    blogErrorMessage.title = 'title is required';
  }

  if (!author) {
    blogErrorMessage.author = 'author is required';
  }

  const urlRegex = /^(https?):\/\/[-\w\d.]+\.[A-Za-z]{2,}(\/.*)?$/;
  if (!url) {
    blogErrorMessage.url = 'url is required';
  } else if (!urlRegex.test(url)) {
    blogErrorMessage.url = 'url incorrect format';
  }

  if (Object.keys(blogErrorMessage).length > 0) {
    return response.status(400).json({ error: blogErrorMessage });
  }

  try {
    const user = request.user;

    if (!user) {
      return response
        .status(401)
        .json({ error: 'invalid token - user not found' });
    }

    if (user.name !== author) {
      blogErrorMessage.author = 'author name mismatched';
    }

    if (Object.keys(blogErrorMessage).length > 0) {
      return response.status(400).json({ error: blogErrorMessage });
    }

    const blog = new Blog({
      title,
      author: user.name,
      url,
      likes: 0,
      user: user._id,
    });

    const savedBlog = await blog.save();

    user.blogs = [...user.blogs, savedBlog._id];

    await user.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

// update blog
blogsRouter.put('/:id', async (request, response, next) => {
  const { title, author, url } = request.body;

  const blogError = {};
  if (!title) {
    blogError.title = 'title is required';
  } else if (title.trim().length < 3) {
    blogError.title = 'title must be at least 3 characters long';
  }

  if (!author) {
    blogError.author = 'author is required';
  } else if (author.trim().length < 3) {
    blogError.author = 'author must be at least 3 characters long';
  }

  const urlRegex =
    /^(http|https):\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?$/;
  if (!url) {
    blogError.author = 'url is required';
  } else if (urlRegex.test(url)) {
    blogError.url = 'invalid url format';
  }

  if (Object.keys(blogError).length > 0) {
    return response.status(400).json({ error: blogError });
  }

  const blog = {
    title,
    author,
    url,
  };

  const id = request.params.id;
  try {
    const updatedBlog = await Blog.findById(id);

    if (!updatedBlog) {
      return response.status(404).json({ error: 'blog not found' });
    }

    updatedBlog.set(blog);
    const savedBlog = await updatedBlog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

// delete blog
blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);

    if (!blog) {
      return response.status(404).json({ error: 'blog not found' });
    }

    const user = request.user;

    if (!user) {
      return response
        .status(401)
        .json({ error: 'invalid token - user not found' });
    }

    if (blog.user.toString() !== user._id.toString()) {
      return response
        .status(403)
        .json({ error: 'unauthorized to delete this blog' });
    }

    await blog.deleteOne();

    user.blogs.filter((b) => b.toString() !== blog._id.toString());
    await user.save();

    return response.status(204).end();
  } catch (error) {
    next(error);
  }
});

// ! debugging (don't include in testing)
blogsRouter.delete('/', async (request, response, next) => {
  try {
    const blogs = await Blog.deleteMany({});

    if (!blogs) {
      return response.status(400).json({ error: 'no blogs found' });
    }

    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
