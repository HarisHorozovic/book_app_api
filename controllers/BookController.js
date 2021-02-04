const db = require('../database');

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
  const { title, pages, published } = req.body;
  let { image, isbn } = req.body;

  if (image == '') image = null;
  if (isbn == '' || isbn == null) {
    res.status(500).json({ status: 'fail', data: 'Book must have ISBN' });
  }

  db('books')
    .insert({ isbn, title, pages, published, image })
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
  const { isbn, title, pages, published } = req.body;
  let { image } = req.body;

  if (!image) image = null;

  db('books')
    .update({ isbn, title, pages, published, image })
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
