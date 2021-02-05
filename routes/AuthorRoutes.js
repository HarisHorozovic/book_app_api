const express = require('express');

const authorController = require('../controllers/AuthorController');
const authController = require('../controllers/AuthController');

const router = express.Router();

router
  .route('/')
  .get(authorController.getAllAuthors)
  .post(authController.isLoggedIn, authorController.createAuthor);

router
  .route('/:id')
  .get(authorController.getAuthor)
  .put(authController.isLoggedIn, authorController.updateAuthor)
  .delete(authController.isLoggedIn, authorController.deleteAuthor);

// Protect routes from unauthorized users
router.use(authController.isLoggedIn);

router
  .route('/:idAuthor/books')
  .get(authorController.booksFromAuthor)
  .post(authorController.addBookToAuthor);

router
  .route('/:idAuthor/books/:idBook')
  .delete(authorController.removeAuthorFromBook);

module.exports = router;
