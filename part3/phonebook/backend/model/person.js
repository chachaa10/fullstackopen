import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);

mongoose.connect(url);
console.log('connected to MongoDB');

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'User name must be at least 3 characters long'],
    required: [true, 'User name required'],
    validate: {
      validator: function (v) {
        return /^[A-Za-z\s]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid name!`,
    },
  },
  number: {
    type: String,
    minlength: [8, 'User phone number must be at least 8 numbers long'],
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, 'User phone number required'],
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const PersonModel = mongoose.model('Person', personSchema);
