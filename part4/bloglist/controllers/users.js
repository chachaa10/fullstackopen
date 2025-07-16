const usersRouter = require('express').Router();
const { User } = require('../models/user');
const bcrypt = require('bcrypt');

usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({}).populate('blogs', {
      title: 1,
      author: 1,
      url: 1,
      likes: 1,
    });

    if (!users) {
      return response.status(404).json({ error: 'users not found' });
    }

    response.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.get('/:id', async (request, response, next) => {
  try {
    const user = await User.findById(request.params.id).populate('blogs', {
      title: 1,
      url: 1,
      likes: 1,
    });

    if (!user) {
      return response.status(404).json({ error: 'user does not exist' });
    }

    response.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// create a new user
usersRouter.post('/', async (request, response, next) => {
  try {
    const { username, name, password } = request.body;

    const userErrorMessage = {};

    if (!username) {
      userErrorMessage.username = 'Username is required.';
    } else if (username.trim().length < 3) {
      userErrorMessage.username = 'Username must be at least 3 characters';
    }

    if (!name) {
      userErrorMessage.name = 'Name is required.';
    } else if (name.trim().length < 3) {
      userErrorMessage.name = 'Name must be at least 3 characters';
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!password) {
      userErrorMessage.password = 'Password is required.';
    } else if (!passwordRegex.test(password)) {
      userErrorMessage.password =
        'Password must contain: 8 characters, 1 letter, 1 number';
    }

    if (Object.keys(userErrorMessage).length > 0) {
      return response.status(400).json({ error: userErrorMessage });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();

    response.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

// delete a user
usersRouter.delete('/:id', async (request, response, next) => {
  try {
    const user = await User.findByIdAndDelete(request.params.id);

    if (!user) {
      return response.status(404).json({ error: 'user does not exist' });
    }

    await user.deleteOne();

    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

// delete all user
usersRouter.delete('/', async (request, response, next) => {
  try {
    const user = await User.deleteMany({});

    if (!user) {
      return response.status(400).json({ error: 'no user data stored' });
    }

    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
