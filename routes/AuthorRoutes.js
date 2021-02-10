const express = require('express');

const authorController = require('../controllers/AuthorController');
const authController = require('../controllers/AuthController');

const upload = require('../utils/multer');
const uploadImage = require('../utils/uploadImage');

const router = express.Router();
/**
 * @swagger
 * /api/v1/authors/:
 *   get:
 *     summary: Get all authors
 *     description: Get all authors from the database
 *     tags:
 *       - authors
 *     responses:
 *       '200':
 *         description: Fetching authors successfull
 *       '404':
 *         description: No authors found
 */

/**
 * @swagger
 * /api/v1/authors/:
 *   post:
 *     summary: Create new author
 *     description: Create new author, image upload is possible, image is uploaded to cloud.
 *     tags:
 *       - authors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Authors first name.
 *               lastname:
 *                 type: string
 *                 description: Authors last name.
 *               dob:
 *                 type: date
 *                 description: Authors date of birth.
 *               image:
 *                 type: file
 *                 description: Authors avatar.
 *     responses:
 *       '201':
 *         description: Author is successfully created
 *       '400':
 *         description: Author must have DOB
 *       '500':
 *         description: Server error
 */
router
  .route('/')
  .get(authorController.getAllAuthors)
  .post(
    authController.protect,
    upload.single('image'),
    uploadImage,
    authorController.createAuthor
  );

/**
 * @swagger
 * /api/v1/authors/{id}:
 *   get:
 *     summary: Get author using UUID
 *     description: Get single author from the database using his UUID
 *     tags:
 *       - authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the author to retrieve.
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
 * /api/v1/authors/{id}:
 *   put:
 *     summary: Update author
 *     description: Update author with the specified UUID
 *     tags:
 *       - authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the author to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Authors first name.
 *               lastname:
 *                 type: string
 *                 description: Authors last name.
 *               dob:
 *                 type: date
 *                 description: Authors date of birth.
 *               image:
 *                 type: file
 *                 description: Authors avatar.
 *     responses:
 *       '200':
 *         description: Author is successfully updated
 *       '404':
 *         description: Author not found
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/authors/{id}:
 *   delete:
 *     summary: Delete author
 *     description: Delete author with the UUID from the database
 *     tags:
 *       - authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the author to delete.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Deleting authors successfull
 *       '404':
 *         description: No authors found
 */

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

/**
 * @swagger
 * /api/v1/authors/{idAuthor}/books:
 *   get:
 *     summary: Get authors books
 *     description: Get all the books of the author with UUID = idAuthor
 *     tags:
 *       - authors
 *     parameters:
 *       - in: path
 *         name: idAuthor
 *         required: true
 *         description: UUID of the author to retrieve books from.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Authors books retrieved
 *       '404':
 *         description: Author does not have any books
 */

/**
 * @swagger
 * /api/v1/authors/{idAuthor}/books:
 *   post:
 *     summary: Assign new book to author
 *     description: Create new relation between book and author
 *     tags:
 *       - authors
 *     parameters:
 *       - in: path
 *         name: idAuthor
 *         required: true
 *         description: UUID of the author to assign book to.
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
 *                 description: Book isbn
 *     responses:
 *       '201':
 *         description: Relation between book and author successfully created
 *       '500':
 *         description: Server error
 */
router
  .route('/:idAuthor/books')
  .get(authorController.booksFromAuthor)
  .post(authController.protect, authorController.addBookToAuthor);

/**
 * @swagger
 * /api/v1/authors/{idAuthor}/books/{idBook}:
 *   delete:
 *     summary: Delete book from author
 *     description: Delete relation between the book and the author
 *     tags:
 *       - authors
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
  .route('/:idAuthor/books/:idBook')
  .delete(authController.protect, authorController.removeAuthorFromBook);

module.exports = router;
