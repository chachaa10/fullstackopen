const dummy = (blogs) => {
  return blogs ? 1 : 0;
};

const totalLikes = (blogs) => {
  if (blogs.length === 0) return 0;

  return blogs.reduce((total, blog) => total + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return 0;

  const maxLikes = Math.max(...blogs.map((blog) => blog.likes));
  return blogs.find((blog) => blog.likes === maxLikes);
};

const mostBlogAuthor = (blogs) => {
  if (blogs.length === 0) return 0;

  let authorCounts = {};

  for (const blog of blogs) {
    const { author } = blog;

    if (author in authorCounts) {
      authorCounts[author]++;
    } else {
      authorCounts[author] = 1;
    }
  }

  let blogsCount = 0;
  let authorWithMostBlogs = {};

  for (const author in authorCounts) {
    if (authorCounts[author] > blogsCount) {
      blogsCount = authorCounts[author];

      authorWithMostBlogs = {
        author: author,
        blogs: blogsCount,
      };
    }
  }

  return authorWithMostBlogs;
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return 0;

  let authorLikes = {};

  for (const blog of blogs) {
    const { author, likes } = blog;

    if (author in authorLikes) {
      authorLikes[author] += likes;
    } else {
      authorLikes[author] = likes;
    }
  }

  let likesCount = -1;
  let authorWithMostLikes = {};

  for (const author in authorLikes) {
    const currentLikes = authorLikes[author];

    if (currentLikes > likesCount) {
      likesCount = currentLikes;

      authorWithMostLikes = {
        author: author,
        likes: likesCount,
      };
    }
  }

  return authorWithMostLikes;
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogAuthor, mostLikes };
