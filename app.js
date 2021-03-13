require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const { linkMongo, mongoSettings } = require('./config');
const cors = require('./middlewares/cors');
const routes = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const ErrorHandler = require('./middlewares/errorsHandler');
const limiter = require('./middlewares/limiterHandler');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

mongoose.connect(linkMongo, mongoSettings);

const app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use(bodyParser.json()); // для собирания JSON-формата

app.use(cors);

app.use(requestLogger);

app.use(routes);
app.use(errorLogger);

app.use(limiter);

app.use(errors());
app.use(ErrorHandler);
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
