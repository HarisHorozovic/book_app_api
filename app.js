const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();
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
