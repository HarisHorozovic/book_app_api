const express = require('express');

const authorController = require('../controllers/AuthorController');

const router = express.Router();

router
  .route('/')
  .get(authorController.getAllAuthors)
  .post(authorController.createAuthor);

router
  .route('/:id')
  .get(authorController.getAuthor)
  .put(authorController.updateAuthor)
  .delete(authorController.deleteAuthor);

router
  .route('/:idAuthor/books')
  .get(authorController.booksFromAuthor)
  .post(authorController.addBookToAuthor);

router
  .route('/:idAuthor/books/:idBook')
  .delete(authorController.removeAuthorFromBook);

module.exports = router;
