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

// Protect routes from unauthorized users
router.use(authController.protect);

router
  .route('/:idAuthor/books')
  .get(authorController.booksFromAuthor)
  .post(authorController.addBookToAuthor);

router
  .route('/:idAuthor/books/:idBook')
  .delete(authorController.removeAuthorFromBook);

module.exports = router;
