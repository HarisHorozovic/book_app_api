const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

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
app.use(morgan('dev'));
app.use(express.json());

// Swagger config
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'BookApp API',
      description: 'Fullstack assignment (BookApp) API inofrmation for BALKON',
      contact: {
        name: 'Haris Horozovic',
      },
      servers: ['http://localhost:5000/api/v1'],
    },
  },
  apis: [`./routes/*.js`],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use(
  '/api/v1/api-docs/swagger',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs)
);

// Initial cors setup, can be changed, but leave it here for now
app.use(
  cors({
    origin: [`${process.env.CORS_ALLOWED_ORIGIN}`, 'http://localhost:3000'],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

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
