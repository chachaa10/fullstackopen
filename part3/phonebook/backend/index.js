import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import { PersonModel } from './model/person';

dotenv.config();

const app = express();

app.use(express.static('dist'));
app.use(express.json());

morgan.token('req-body', (req, res) => {
  if (req.method === 'POST' && req.body) {
    return JSON.stringify(req.body);
  }

  return '-';
});

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

app.get('/api/persons/:id', (req, res) => {
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
      console.log('error:', error);
      res.status(500).json({ error: 'cannot fetch person' });
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

  PersonModel.create(person)
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => {
      res.status(500).json({ error: 'cannot save person' });
    });
});

app.put('/api/persons/:id', (req, res) => {
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
      res.status(500).json({ error: 'cannot update person' });
    });
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;

  // check if person exists
  PersonModel.find({}).then((persons) => {
    if (!persons.find((person) => person.id === id)) {
      return res.status(400).json({
        error: 'person not found',
      });
    }
  });

  // delete person
  PersonModel.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => {
      console.log('error:', error);
      res.status(500).json({ error: 'cannot delete person' });
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
