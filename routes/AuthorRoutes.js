const express = require('express');

const authorController = require('../controllers/AuthorController');
const authController = require('../controllers/AuthController');

const upload = require('../utils/multer');
const uploadImage = require('../utils/uploadImage');

const router = express.Router();

router
  .route('/')
  .get(authorController.getAllAuthors)
  .post(
    authController.protect,
    upload.single('image'),
    uploadImage,
    authorController.createAuthor
  );

router
  .route('/:id')
  .get(authorController.getAuthor)
  .put(
    authController.protect,
    upload.single('image'),
    uploadImage,
    authorController.updateAuthor
  )
  .delete(authController.protect, authorController.deleteAuthor);

router
  .route('/:idAuthor/books')
  .get(authorController.booksFromAuthor)
  .post(authController.protect, authorController.addBookToAuthor);

router
  .route('/:idAuthor/books/:idBook')
  .delete(authController.protect, authorController.removeAuthorFromBook);

module.exports = router;
