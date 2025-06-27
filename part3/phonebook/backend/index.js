import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import { PersonModel } from './model/person';

dotenv.config();

const app = express();

// middlewares
morgan.token('req-body', (req, res) => {
  if (req.method === 'POST' && req.body) {
    return JSON.stringify(req.body);
  }

  return '-';
});

app.use(express.static('dist'));
app.use(express.json());
app.use(
  morgan(
    `:method :url :status :res[content-length] - :response-time ms || Body: :req-body`
  )
);

app.get('/api/persons', (req, res) => {
  PersonModel.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => {
      res.status(500).json({ error: 'cannot fetch persons' });
    });
});

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;

  PersonModel.findById(id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing',
    });
  }

  // save person
  const person = {
    name: body.name,
    number: body.number,
  };

  PersonModel.create(person).then((savedPerson) => {
    res.json(savedPerson);
  });
});

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing',
    });
  }

  const person = {
    name: body.name,
    number: body.number,
  };

  PersonModel.findByIdAndUpdate(id, person, { new: true })
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => {
      next(error);
    });
});

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;

  // delete person
  PersonModel.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

// error handlers
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError')
    return res.status(400).send({ error: 'malformatted id' });

  next(error);
};

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
