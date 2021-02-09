const db = require('../database');
const cloudinary = require('../utils/cloudinary');

exports.getAllBooks = (req, res) => {
  db.select()
    .from('books')
    .then((data) => {
      if (data.length < 1) {
        res.status(404).json({ status: 'fail', error: 'No books found' });
      } else {
        res.status(200).json({ status: 'success', books: data });
      }
    });
};

exports.createBook = (req, res) => {
  const { title, pages, published, cloudinary_id } = req.body;
  let { imageurl, isbn } = req.body;

  console.log(imageurl);

  if (imageurl == '' || !imageurl) imageurl = null;

  if (isbn == '' || isbn == null) {
    return res
      .status(500)
      .json({ status: 'fail', error: 'Book must have ISBN' });
  }

  db.select()
    .from('books')
    .where('isbn', isbn)
    .then((data) => {
      console.log(data);
      if (data && data.length > 1) {
        res.status(403).json({
          status: 'fail',
          message: 'There is already a book with that ISBN',
        });
      } else {
        db('books')
          .insert({
            isbn,
            title,
            pages,
            published,
            image: imageurl,
            cloudinary_id,
          })
          .then((data) => {
            res.status(201).json({
              status: 'success',
              message: 'Book successfully created',
            });
          });
      }
    });
};

exports.getBook = (req, res) => {
  db.select()
    .from('books')
    .where('isbn', req.params.id)
    .then((data) => {
      if (data.length < 1) {
        res.status(404).json({ status: 'not found', error: 'Book not found' });
      } else {
        res.status(200).json({ status: 'success', book: data[0] });
      }
    });
};

exports.updateBook = (req, res) => {
  const { isbn, title, pages, published, cloudinary_id } = req.body;
  let { imageurl } = req.body;

  // Check to see if the image is beeing uploaded
  if (!imageurl) imageurl = null;
  // If it is then delete old image from the cloud
  else {
    // Retrieve the book we want to update
    db.select('cloudinary_id')
      .from('books')
      .where({ isbn: req.params.id })
      .then((data) => {
        old_cloudinary_id = data[0].cloudinary_id;

        // Delete old image from cloudinary
        if (old_cloudinary_id || old_cloudinary_id != '') {
          cloudinary.uploader.destroy(old_cloudinary_id, function (err, res) {
            console.log(err, res);
          });
        }
      });
  }

  db('books')
    .update({ isbn, title, pages, published, image: imageurl, cloudinary_id })
    .where({ isbn: req.params.id })
    .then((data) => {
      if (data < 1) {
        res.status(404).json({
          status: 'error',
          error: 'Cannot update book, book not found',
        });
      } else {
        res
          .status(200)
          .json({ status: 'success', message: 'Book updated successfully' });
      }
    });
};

exports.deleteBook = (req, res) => {
  // Remove author from all the books
  db('book_authors')
    .delete()
    .where('book_id', req.params.id)
    .then(() => {});

  // Retrieve the user we want to delete
  db.select('cloudinary_id')
    .from('books')
    .where({ isbn: req.params.id })
    .then((data) => {
      old_cloudinary_id = data[0].cloudinary_id;

      // Delete old image from cloudinary
      if (old_cloudinary_id || old_cloudinary_id != '') {
        cloudinary.uploader.destroy(old_cloudinary_id, function (err, res) {
          console.log(err, res);
        });
      }
    });

  db('books')
    .delete()
    .where('isbn', req.params.id)
    .then((data) => {
      if (data < 1) {
        res.status(404).json({
          status: 'error',
          error: 'Cannot delete book, book not found',
        });
      } else {
        res
          .status(200)
          .json({ status: 'success', message: 'Book deleted successfully' });
      }
    });
};

exports.getBookAuthors = (req, res) => {
  db.select(
    db.raw(
      `b.isbn, a.* from books b inner join book_authors ba on ba.book_id = b.isbn inner join authors a on a.id = ba.author_id`
    )
  )
    .where('isbn', req.params.id)
    .then((data) => {
      if (data.length < 1) {
        res.status(404).json({
          status: 'fail',
          error: 'There are no authors for this book',
        });
      } else {
        res.status(200).json({ status: 'success', bookAuthors: data });
      }
    })
    .catch((err) => {
      res.status(404).json({
        status: 'fail',
        error: 'There are no authors for this book',
      });
    });
};

exports.addNewBookAuthor = (req, res) => {
  const { id } = req.params;
  const { idAuthor } = req.body;

  db('book_authors')
    .insert({ author_id: idAuthor, book_id: id })
    .then((data) => {
      res
        .status(200)
        .json({ status: 'success', message: 'Author succesfully added' });
    })
    .catch((err) => {
      res.status(500).json({
        status: 'error',
        error: 'This author is already books author',
      });
    });
};
