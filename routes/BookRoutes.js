const express = require('express');

const bookController = require('../controllers/BookController');
const authorController = require('../controllers/AuthorController');

const router = express.Router();

router
  .route('/')
  .get(bookController.getAllBooks)
  .post(bookController.createBook);

router
  .route('/:id')
  .get(bookController.getBook)
  .put(bookController.updateBook)
  .delete(bookController.deleteBook);

router
  .route('/:id/authors')
  .get(bookController.getBookAuthors)
  .post(bookController.addNewBookAuthor);

router
  .route('/:idBook/authors/:idAuthor')
  .delete(authorController.removeAuthorFromBook);

module.exports = router;
