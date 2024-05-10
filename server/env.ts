import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

interface IEnv {
  port: string;
  authURL: string;
  cookieName: string;
  cookiePath: string;
  mongoURI: string;
}

if (process.env.PORT === undefined) {
  process.env.PORT = '8000';
}

if (process.env.AUTH_URL === undefined) {
  process.env.AUTH_URL = 'auth.zetin.uos.ac.kr';
}

if (process.env.COOKIE_NAME === undefined) {
  process.env.COOKIE_NAME = 'adminToken';
}

if (process.env.COOKIE_PATH === undefined) {
  process.env.COOKIE_PATH = '/api';
}

if (process.env.MONGO_URI === undefined) {
  process.env.MONGO_URI = `mongodb:/${process.env.MONGO_HOST || 'localhost'}:${
    process.env.MONGO_PORT || 27017
  }/${process.env.MONGO_NAME || 'zetin-competition'}`;
}

const env: IEnv = {
  port: process.env.PORT,
  authURL: process.env.AUTH_URL,
  cookieName: process.env.COOKIE_NAME,
  cookiePath: process.env.COOKIE_PATH,
  mongoURI: process.env.MONGO_URI,
};

export default env;
