import mongoose from 'mongoose';
import config from './env-config.js';

export const connectToDatabase = () => {
  mongoose.connect(config.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
};