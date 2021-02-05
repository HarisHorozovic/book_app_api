const express = require('express');

const bookController = require('../controllers/BookController');
const authorController = require('../controllers/AuthorController');
const authController = require('../controllers/AuthController');

const router = express.Router();

router
  .route('/')
  .get(bookController.getAllBooks)
  .post(authController.isLoggedIn, bookController.createBook);

router
  .route('/:id')
  .get(bookController.getBook)
  .put(authController.isLoggedIn, bookController.updateBook)
  .delete(authController.isLoggedIn, bookController.deleteBook);

// Protect routes from unauthorized users
router.use(authController.isLoggedIn);

router
  .route('/:id/authors')
  .get(bookController.getBookAuthors)
  .post(bookController.addNewBookAuthor);

router
  .route('/:idBook/authors/:idAuthor')
  .delete(authorController.removeAuthorFromBook);

module.exports = router;
