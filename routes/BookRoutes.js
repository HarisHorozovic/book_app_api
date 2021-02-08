const express = require('express');

const bookController = require('../controllers/BookController');
const authorController = require('../controllers/AuthorController');
const authController = require('../controllers/AuthController');

const upload = require('../utils/multer');
const uploadImage = require('../utils/uploadImage');

const router = express.Router();

router
  .route('/')
  .get(bookController.getAllBooks)
  .post(
    authController.protect,
    upload.single('image'),
    uploadImage,
    bookController.createBook
  );

router
  .route('/:id')
  .get(bookController.getBook)
  .put(
    authController.protect,
    upload.single('image'),
    uploadImage,
    bookController.updateBook
  )
  .delete(authController.protect, bookController.deleteBook);

// Protect routes from unauthorized users
router.use(authController.protect);

router
  .route('/:id/authors')
  .get(bookController.getBookAuthors)
  .post(bookController.addNewBookAuthor);

router
  .route('/:idBook/authors/:idAuthor')
  .delete(authorController.removeAuthorFromBook);

module.exports = router;
