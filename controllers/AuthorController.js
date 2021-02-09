const db = require('../database');
const cloudinary = require('../utils/cloudinary');

exports.getAllAuthors = (req, res) => {
  db.select()
    .from('authors')
    .then((data) => {
      if (data.length < 1)
        res.status(404).json({ status: 'fail', error: 'No authors found' });
      else {
        res.status(200).json({ status: 'success', author: data });
      }
    });
};

exports.createAuthor = (req, res) => {
  const { firstName, lastName, dob, cloudinary_id } = req.body;
  let { imageurl } = req.body;

  if (imageurl == '' || !imageurl) imageurl = null;

  if (!dob || dob == '') {
    return res
      .status(400)
      .json({ status: 'error', error: 'User must have date of birth' });
  }
  db('authors')
    .insert({ firstName, lastName, dob, image: imageurl, cloudinary_id })
    .then((data) => {
      res
        .status(201)
        .json({ status: 'created', message: 'Author successfully created' });
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', error: err });
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
          .json({ status: 'not found', error: 'Author not found' });
      } else {
        res.status(200).json({ status: 'success', author: data[0] });
      }
    });
};

exports.updateAuthor = (req, res) => {
  const { firstName, lastName, dob, cloudinary_id } = req.body;
  let { imageurl } = req.body;
  let old_cloudinary_id;

  // Check to see if the image is beeing uploaded
  if (!imageurl) imageurl = null;
  // If it is then delete old image from the cloud
  else {
    // Retrieve the author we want to update
    db.select('cloudinary_id')
      .from('authors')
      .where({ id: req.params.id })
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

  db('authors')
    .update({ firstName, lastName, dob, image: imageurl, cloudinary_id })
    .where({ id: req.params.id })
    .then((data) => {
      if (data < 1) {
        res.status(404).json({ status: 'error', error: 'Author not found' });
      } else {
        res
          .status(200)
          .json({ status: 'success', message: 'Author sucessfully updated' });
      }
    });
};

exports.deleteAuthor = (req, res) => {
  // Remove author from all the books
  db('book_authors')
    .delete()
    .where('author_id', req.params.id)
    .then(() => {});

  // Retrieve the user we want to delete
  db.select('cloudinary_id')
    .from('authors')
    .where({ id: req.params.id })
    .then((data) => {
      old_cloudinary_id = data[0].cloudinary_id;

      // Delete old image from cloudinary
      if (old_cloudinary_id || old_cloudinary_id != '') {
        cloudinary.uploader.destroy(old_cloudinary_id, function (err, res) {
          console.log(err, res);
        });
      }
    });

  db('authors')
    .delete()
    .where('id', req.params.id)
    .then((data) => {
      if (data < 1) {
        res.status(404).json({ status: 'error', error: 'Author not found' });
      } else {
        res
          .status(200)
          .json({ status: 'success', message: 'Author successfully deleted' });
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
        res.status(404).json({
          status: 'fail',
          error: 'Author not found, can not add book',
        });
      } else {
        res.status(200).json({ status: 'success', authorBooks: data });
      }
    });
};

exports.addBookToAuthor = (req, res) => {
  console.log(req.body);
  const { idAuthor } = req.params;
  const { idBook } = req.body;

  db('book_authors')
    .insert({ author_id: idAuthor, book_id: idBook })
    .then((data) => {
      res
        .status(200)
        .json({ status: 'success', message: 'Book added successfully' });
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', error: err });
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
          error: 'This author did not publish that book',
        });
      } else {
        res.status(200).json({
          status: 'success',
          message: 'Succesfully removed this books author',
        });
      }
    });
};
