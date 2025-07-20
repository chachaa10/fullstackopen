const { test, describe, beforeEach, after } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const listHelper = require('../utils/list_helpers.js');
const {
  blogs,
  listWithOneBlog,
  blogsInDb,
  nonExistingId,
} = require('./blog_helpers.js');
const mongoose = require('mongoose');
const { Blog } = require('../models/blog');
const { User } = require('../models/user');
const app = require('../app');

const api = supertest(app);
let token = '';

describe('when there is initialized data', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    const newUser = {
      username: 'test',
      name: 'user test',
      password: 'Password123',
    };

    await api.post('/api/users').send(newUser);

    const loginRes = await api
      .post('/api/login')
      .send({ username: newUser.username, password: newUser.password });

    token = loginRes.body.token;

    for (const blog of blogs) {
      const blogData = { ...blog };
      delete blogData.user;

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogData);
    }
  });

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    assert.strictEqual(response.body.length, blogs.length);
  });

  test('a specific blog is within the returned blogs', async () => {
    const blogs = await blogsInDb();
    const titles = blogs.map((blog) => blog.title);
    console.log('titles:', titles)
    assert(titles.includes('React patterns'));
  });

  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogAtStart = await blogsInDb();
      const blogToView = blogAtStart[0];

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.deepStrictEqual(resultBlog.body.title, blogToView.title);
    });

    test('fails with status code 404 if blog does not exist', async () => {
      const validNonexistingId = await nonExistingId();
      await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
    });

    test('fails with status code 400 if id is invalid', async () => {
      const invalidId = '5a422a851b54a676234d17f';
      await api.get(`/api/blogs/${invalidId}`).expect(400);
    });
  });

  describe('addition of a new blog', () => {
    test('a valid blog can be added with token', async () => {
      const newBlog = {
        title: 'React Library',
        author: 'Draven',
        url: 'https://reactlibrary.com',
        likes: 10,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogs.length + 1);
    });

    test('likes default to 0 if not provided', async () => {
      const newBlog = {
        title: 'No Likes Yet',
        author: 'Draven',
        url: 'https://nolikes.com',
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201);

      const blogsAtEnd = await blogsInDb();
      const lastBlog = blogsAtEnd[blogsAtEnd.length - 1];

      assert.strictEqual(lastBlog.likes, 0);
    });

    test('fails with 400 if title or url missing', async () => {
      const newBlog = {
        author: 'Draven',
        likes: 5,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400);
    });

    test('fails with 401 if token is missing', async () => {
      const newBlog = {
        title: 'No Token Blog',
        author: 'Intruder',
        url: 'https://notoken.com',
      };

      await api.post('/api/blogs').send(newBlog).expect(401);
    });
  });

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id and token are valid', async () => {
      const blogsAtStart = await blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      const blogsAtEnd = await blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
    });

    test('fails with 401 if token is missing', async () => {
      const blogsAtStart = await blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);
    });

    test('fails with 400 if id is invalid', async () => {
      const invalidId = '5a422a851b54a676234d17f';
      await api
        .delete(`/api/blogs/${invalidId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });
  });

  describe('total likes', () => {
    test('of empty list is zero', () => {
      const result = listHelper.totalLikes([]);
      assert.strictEqual(result, 0);
    });

    test('when list has one blog, equals its likes', () => {
      const result = listHelper.totalLikes(listWithOneBlog);
      assert.strictEqual(result, 5);
    });

    test('of a bigger list is correct', () => {
      const result = listHelper.totalLikes(blogs);
      assert.strictEqual(result, 36);
    });
  });

  describe('favorite blog', () => {
    test('of empty list is zero', () => {
      const result = listHelper.favoriteBlog([]);
      assert.strictEqual(result, 0);
    });

    test('of a bigger list is calculated correctly', () => {
      const result = listHelper.favoriteBlog(blogs);
      const expected = {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        user: {
          username: 'edsger',
          name: 'Edsger W. Dijkstra',
          _id: '68770be28f7525411d3b8d58',
          __v: 0,
        },
        likes: 12,
        __v: 0,
      };

      assert.deepStrictEqual(result, expected);
    });
  });

  describe('most blog author', () => {
    test('of empty list is zero', () => {
      const result = listHelper.mostBlogAuthor([]);
      assert.strictEqual(result, 0);
    });

    test('of a bigger list is correct', () => {
      const result = listHelper.mostBlogAuthor(blogs);
      const expected = {
        author: 'Robert C. Martin',
        blogs: 3,
      };

      assert.deepStrictEqual(result, expected);
    });
  });

  describe('most likes author', () => {
    test('of empty list is zero', () => {
      const result = listHelper.mostLikes([]);
      assert.strictEqual(result, 0);
    });

    test('of a bigger list is correct', () => {
      const result = listHelper.mostLikes(blogs);
      const expected = {
        author: 'Edsger W. Dijkstra',
        likes: 17,
      };

      assert.deepStrictEqual(result, expected);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
