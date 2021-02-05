const db = require('../database');
const cloudinary = require('../utils/cloudinary');

exports.getAllBooks = (req, res) => {
  db.select()
    .from('books')
    .then((data) => {
      if (data.length < 1) {
        res.status(404).json({ status: 'fail', data: 'No books found' });
      } else {
        res.status(200).json({ status: 'success', data });
      }
    });
};

exports.createBook = (req, res) => {
  const { title, pages, published, cloudinary_id } = req.body;
  let { imageurl, isbn } = req.body;

  if (imageurl == '' || !imageurl) imageurl = null;

  if (isbn == '' || isbn == null) {
    res.status(500).json({ status: 'fail', data: 'Book must have ISBN' });
  }

  db('books')
    .insert({ isbn, title, pages, published, image: imageurl, cloudinary_id })
    .then((data) => {
      res.status(201).json({ status: 'success', data });
    });
};

exports.getBook = (req, res) => {
  db.select()
    .from('books')
    .where('isbn', req.params.id)
    .then((data) => {
      if (data.length < 1) {
        res
          .status(404)
          .json({ status: 'not found', message: 'Book not found' });
      } else {
        res.status(200).json({ status: 'success', data });
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
    // Retrieve the user we want to update
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
          data: 'Cannot update book, book not found',
        });
      } else {
        res.status(200).json({ status: 'success', data });
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
          data: 'Cannot delete book, book not found',
        });
      } else {
        res
          .status(200)
          .json({ status: 'success', data: 'Book deleted successfully' });
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
        res
          .status(404)
          .json({ status: 'fail', data: 'Book not found, can not add author' });
      } else {
        res.status(200).json({ status: 'success', data });
      }
    });
};

exports.addNewBookAuthor = (req, res) => {
  const { id } = req.params;
  const { idAuthor } = req.body;

  db('book_authors')
    .insert({ author_id: idAuthor, book_id: id })
    .then((data) => {
      res.status(200).json({ status: 'success', data });
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', err });
    });
};
