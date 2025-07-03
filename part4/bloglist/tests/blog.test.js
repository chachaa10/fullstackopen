const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const listHelper = require('../utils/list_helpers.js');
const { blogs, listWithOneBlog, blogsInDb } = require('./blog_helpers.js');
const mongoose = require('mongoose');
const { BlogModel } = require('../models/blog');
const app = require('../app');

const api = supertest(app);

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

test('a valid blog ca be added', async () => {
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
