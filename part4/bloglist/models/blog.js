const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [3, 'Title must be at least 3 characters long'],
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    minlength: [3, 'Author must be at least 3 characters long'],
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    validate: {
      validator: (value) => {
        return value.startsWith('http://') || value.startsWith('https://');
      },
      message: 'Invalid URL',
    },
  },
  likes: Number,
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports.BlogModel = mongoose.model('Blog', blogSchema);
