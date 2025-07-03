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
const { BlogModel } = require('../models/blog');
const app = require('../app');

const api = supertest(app);

describe('when there is initialize data', () => {
  beforeEach(async () => {
    await BlogModel.deleteMany({});
    await BlogModel.insertMany(blogs);
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

      assert.deepStrictEqual(resultBlog.body, blogToView);
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
    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'React Library',
        author: 'Draven',
        url: 'https://reactlibrary.com',
        likes: 10,
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await blogsInDb();

      assert.strictEqual(blogsAtEnd.length, blogs.length + 1);
    });

    test('likes property is missing from the request', async () => {
      const newBlog = {
        title: 'React Library',
        author: 'Draven',
        url: 'https://reactlibrary.com',
      };

      await api.post('/api/blogs').send(newBlog).expect(201);

      const blogsAtEnd = await blogsInDb();
      const lastBlog = blogsAtEnd[blogsAtEnd.length - 1];

      assert.strictEqual(blogsAtEnd.length, blogs.length + 1);
      assert.strictEqual(lastBlog.likes, 0);
    });

    test('title or url properties is missing from the request', async () => {
      const newBlog = {
        author: 'Draven',
        likes: 10,
      };

      await api.post('/api/blogs').send(newBlog).expect(400);
    });
  });

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogAtStart = await blogsInDb();
      const blogToDelete = blogAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

      const blogsAtEnd = await blogsInDb();

      assert.strictEqual(blogsAtEnd.length, blogAtStart.length - 1);
    });

    test('fails with status code 400 if id is invalid', async () => {
      const invalidId = '5a422a851b54a676234d17f';
      await api.delete(`/api/blogs/${invalidId}`).expect(400);
    });
  });

  describe('total likes', () => {
    test('of empty list is zero', () => {
      const result = listHelper.totalLikes([]);
      assert.strictEqual(result, 0);
    });

    test('when list has only one blog, equals the likes of that', () => {
      const result = listHelper.totalLikes(listWithOneBlog);
      assert.strictEqual(result, 5);
    });

    test('of a bigger list is calculated right', () => {
      const result = listHelper.totalLikes(blogs);
      assert.strictEqual(result, 36);
    });
  });

  describe('favorite blog', () => {
    test('of empty list is zero', () => {
      const result = listHelper.favoriteBlog([]);
      assert.strictEqual(result, 0);
    });

    test('of a bigger list is calculated right', () => {
      const result = listHelper.favoriteBlog(blogs);

      const expected = {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
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

    test('of a bigger list is calculated right', () => {
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

    test('of a bigger list is calculated right', () => {
      const result = listHelper.mostLikes(blogs);
      console.log('result:', result);

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
