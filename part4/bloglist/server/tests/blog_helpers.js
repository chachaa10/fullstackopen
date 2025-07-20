const { BlogModel } = require('../models/blog');
const { Blog } = require('../models/blog');

const blogsInDb = async () => {
  const blogs = await BlogModel.find({});
  return blogs.map((blog) => blog.toJSON());
};

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    user: {
      username: 'edsger',
      name: 'edsger',
      _id: '68770be28f7525411d3b8d58',
      __v: 0,
    },
    likes: 5,
    __v: 0,
  },
];

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    user: {
      username: 'michaelc',
      name: 'Michael Chan',
      _id: '68770be28f7525411d3b8d59',
      __v: 0,
    },
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    user: {
      username: 'edsger',
      name: 'Edsger W. Dijkstra',
      _id: '68770be28f7525411d3b8d58',
      __v: 0,
    },
    likes: 5,
    __v: 0,
  },
  {
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
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    user: {
      username: 'robertm',
      name: 'Robert C. Martin',
      _id: '68770be28f7525411d3b8d60',
      __v: 0,
    },
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    user: {
      username: 'robertm',
      name: 'Robert C. Martin',
      _id: '68770be28f7525411d3b8d60',
      __v: 0,
    },
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    user: {
      username: 'robertm',
      name: 'Robert C. Martin',
      _id: '68770be28f7525411d3b8d60',
      __v: 0,
    },
    likes: 2,
    __v: 0,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    author: 'temp',
    url: 'tempurl.com',
    likes: 0,
  });
  await blog.save();
  await blog.deleteOne();
  return blog._id.toString();
};

module.exports = {
  listWithOneBlog,
  blogs,
  blogsInDb,
  nonExistingId,
};
