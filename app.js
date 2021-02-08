const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// Initial cors setup, can be changed, but leave it here for now
app.use(
  cors({
    origin: [`${process.env.CORS_ALLOWED_ORIGIN}`, 'http://localhost:3000'],
    credentials: true,
  })
);
// prevent CORS problems
app.use(function (req, res, next) {
  res.header('Content-Type', 'application/json;charset=UTF-8');
  res.header(
    'Access-Control-Allow-Origin',
    `${process.env.CORS_ALLOWED_ORIGIN}`
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH ,DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use(cookieParser());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

// Routers
const bookRouter = require('./routes/BookRoutes');
const authorRouter = require('./routes/AuthorRoutes');
const authRouter = require('./routes/AuthRoutes');

// **************************Routes*************************
app.use('/api/v1/books', bookRouter);
app.use('/api/v1/authors', authorRouter);
app.use('/api/v1/auth', authRouter);

app.all('*', (req, res, next) => {
  res.status('404').json({
    status: 'fail',
    message:
      'That route is not implemented in this project. Check to see if your route is spelled correctly.',
  });
});

module.exports = app;
