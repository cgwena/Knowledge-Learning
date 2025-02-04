import createError from 'http-errors';
import express from 'express';
import path from 'path';
import url from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import Stripe from 'stripe';

// Détermine le répertoire courant avec import.meta.url
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';

// Corrigez l'importation ici
import clientDbInitConnection from './db/mongo.js';  // Import de la fonction directement

// Initialisation de la connexion à la DB
clientDbInitConnection();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors({
  exposedHeaders:['Authorization'],
  origin: '*'
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

export default app;
