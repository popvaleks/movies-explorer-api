require('dotenv').config();

const {
  JWT_SECRET = 'jwt-secret',
  linkMongo = 'mongodb://localhost:27017/bitfilmsdb',
  domainCookie = '',
  secureCookie = false,
} = process.env;
const whiteList = ['https://www.popvaleks.students.nomoreparties.xyz', 'https://popvaleks.students.nomoreparties.xyz', 'http://localhost:3000'];
const corsSettings = {
  origin: whiteList,
  // "methods": "GET,HEAD,PUT,PATCH,POST,DELETE", // default
  // "preflightContinue": false,
  // "optionsSuccessStatus": 204,
  credentials: true,
};
const mongoSettings = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

module.exports = {
  JWT_SECRET,
  linkMongo,
  domainCookie,
  secureCookie,
  whiteList,
  mongoSettings,
  corsSettings,
};
