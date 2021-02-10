const express = require('express');

const bookController = require('../controllers/BookController');
const authorController = require('../controllers/AuthorController');
const authController = require('../controllers/AuthController');

const upload = require('../utils/multer');
const uploadImage = require('../utils/uploadImage');

const router = express.Router();

/**
 * @swagger
 * /api/v1/books/:
 *   get:
 *     summary: Get all books
 *     description: Get all books from the database
 *     tags:
 *       - books
 *     responses:
 *       '200':
 *         description: Fetching books successfull
 *       '404':
 *         description: No books found
 */

/**
 * @swagger
 * /api/v1/books/:
 *   post:
 *     summary: Create new book
 *     description: Create new author, image upload is possible, image is uploaded to cloud.
 *     tags:
 *       - books
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isbn:
 *                 type: string
 *                 description: Books ISBN.
 *               title:
 *                 type: string
 *                 description: Books title.
 *               published:
 *                 type: integer
 *                 description: Date of the books publishing.
 *               pages:
 *                 type: integer
 *                 description: Number of pages.
 *               image:
 *                 type: file
 *                 description: Books avatar.
 *     responses:
 *       '201':
 *         description: Book is successfully created
 *       '403':
 *         description: There is already book with that ISBN
 *       '500':
 *         description: Server error
 */

router
  .route('/')
  .get(bookController.getAllBooks)
  .post(
    authController.protect,
    upload.single('image'),
    uploadImage,
    bookController.createBook
  );

/**
 * @swagger
 * /api/v1/books/{id}:
 *   get:
 *     summary: Get book using ISBN
 *     description: Get single book from the database using ISBN
 *     tags:
 *       - books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ISBN of the book to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Fetching author successfull
 *       '404':
 *         description: Author not found
 */

/**
 * @swagger
 * /api/v1/books/{id}:
 *   put:
 *     summary: Update book
 *     description: Update book with the specified ISBN
 *     tags:
 *       - books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ISBN of the book to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isbn:
 *                 type: string
 *                 description: Books ISBN.
 *               title:
 *                 type: string
 *                 description: Books title.
 *               published:
 *                 type: integer
 *                 description: Date of the books publishing.
 *               pages:
 *                 type: integer
 *                 description: Number of pages.
 *               image:
 *                 type: file
 *                 description: Books avatar.
 *     responses:
 *       '200':
 *         description: Book is successfully updated
 *       '404':
 *         description: Book not found
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/books/{id}:
 *   delete:
 *     summary: Delete book
 *     description: Delete book with the ISBN from the database
 *     tags:
 *       - books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ISBN of the book to delete.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Deleting books successfull
 *       '404':
 *         description: No books found
 */

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

/**
 * @swagger
 * /api/v1/books/{id}/authors:
 *   get:
 *     summary: Get books authors
 *     description: Get all the authors of the book with ISBN = id
 *     tags:
 *       - books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ISBN of the book to retrieve authors from.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Books author retrieved
 *       '404':
 *         description: Book does not have any authors
 */

/**
 * @swagger
 * /api/v1/books/{id}/authors:
 *   post:
 *     summary: Assign new author to book
 *     description: Create new relation between book and author
 *     tags:
 *       - books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ISBN of the book to assign author to.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idAuthor:
 *                 type: string
 *                 description: Author UUID
 *     responses:
 *       '201':
 *         description: Relation between book and author successfully created
 *       '500':
 *         description: Book and author already have a relation
 */
router
  .route('/:id/authors')
  .get(bookController.getBookAuthors)
  .post(authController.protect, bookController.addNewBookAuthor);

/**
 * @swagger
 * /api/v1/books/{idBook}/authors/{idAuthor}:
 *   delete:
 *     summary: Delete author from book
 *     description: Delete relation between the book and the author
 *     tags:
 *       - books
 *     parameters:
 *       - in: path
 *         name: idAuthor
 *         required: true
 *         description: UUID of the author to delete.
 *         schema:
 *           type: string
 *       - in: path
 *         name: idBook
 *         required: true
 *         description: ISBN of the book to delete.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Deleted successfully
 *       '404':
 *         description: This author did not publish that book
 */
router
  .route('/:idBook/authors/:idAuthor')
  .delete(authController.protect, authorController.removeAuthorFromBook);

module.exports = router;
