const db = require('../database');

exports.getAllAuthors = (req, res) => {
  db.select()
    .from('authors')
    .then((data) => {
      if (data.length < 1)
        res.status(404).json({ status: 'fail', data: 'No authors found' });
      else {
        res.status(200).json({ status: 'success', data });
      }
    });
};

exports.createAuthor = (req, res) => {
  const { firstName, lastName, dob } = req.body;
  let { image } = req.body;

  if (image == '') image = null;

  db('authors')
    .insert({ firstName, lastName, dob, image })
    .then((data) => {
      res
        .status(201)
        .json({ status: 'created', data: 'Author successfully created' });
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', err });
    });
};

exports.getAuthor = (req, res) => {
  db.select()
    .from('authors')
    .where('id', req.params.id)
    .then((data) => {
      if (data.length < 1) {
        res
          .status(404)
          .json({ status: 'not found', message: 'Author not found' });
      } else {
        res.status(200).json({ status: 'success', data });
      }
    });
};

exports.updateAuthor = (req, res) => {
  const { firstName, lastName, dob } = req.body;
  let { image } = req.body;

  if (!image) image = null;

  db('authors')
    .update({ firstName, lastName, dob, image })
    .where({ id: req.params.id })
    .then((data) => {
      if (data < 1) {
        res.status(404).json({ status: 'error', data: 'Author not found' });
      } else {
        res.status(200).json({ status: 'success', data });
      }
    });
};

exports.deleteAuthor = (req, res) => {
  db('authors')
    .delete()
    .where('id', req.params.id)
    .then((data) => {
      if (data < 1) {
        res.status(404).json({ status: 'error', data: 'Author not found' });
      } else {
        res.status(200).json({ status: 'success', data });
      }
    });
};

exports.booksFromAuthor = (req, res) => {
  db.select(
    db.raw(
      `a.id, b.* from authors a inner join book_authors ba on ba.author_id = a.id inner join books b on b.isbn = ba.book_id`
    )
  )
    .where('id', req.params.idAuthor)
    .then((data) => {
      if (data.length < 1) {
        res
          .status(404)
          .json({ status: 'fail', data: 'Author not found, can not add book' });
      } else {
        res.status(200).json({ status: 'success', data });
      }
    });
};

exports.addBookToAuthor = (req, res) => {
  const { idAuthor } = req.params;
  const { idBook } = req.body;

  db('book_authors')
    .insert({ author_id: idAuthor, book_id: idBook })
    .then((data) => {
      res.status(200).json({ status: 'success', data });
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', err });
    });
};

exports.removeAuthorFromBook = (req, res) => {
  const { idAuthor, idBook } = req.params;

  db('book_authors')
    .where({ author_id: idAuthor, book_id: idBook })
    .delete()
    .then((data) => {
      if (data < 1) {
        res.status(404).json({
          status: 'fail',
          data: 'This author did not publish that book',
        });
      } else {
        res.status(200).json({
          status: 'success',
          data: 'Succesfully removed this books author',
        });
      }
    });
};
