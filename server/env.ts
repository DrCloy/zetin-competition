import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

interface IEnv {
  port: string;
  mongoURI: string;
}

if (process.env.PORT === undefined) {
  process.env.PORT = '8000';
}

if (process.env.MONGO_URI === undefined) {
  process.env.MONGO_URI = `mongodb:/${process.env.MONGO_HOST || 'localhost'}:${
    process.env.MONGO_PORT || 27017
  }/${process.env.MONGO_NAME || 'zetin-competition'}`;
}

const env: IEnv = {
  port: process.env.PORT,
  mongoURI: process.env.MONGO_URI,
};

export default env;
