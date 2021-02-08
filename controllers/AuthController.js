const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = require('../database');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7 days',
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    secure: false,
    httpOnly: true,
  };

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    user,
  });
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await db.select().from('users').where('username', username);

    const validLogin = await bcrypt.compare(password, user[0].password);
    console.log(validLogin);

    if (!validLogin) {
      res
        .status(404)
        .json({ status: 'error', error: 'Incorrect username or password' });
    } else {
      createAndSendToken(user[0], 200, res);
    }
  } catch (err) {
    res
      .status(404)
      .json({ status: 'error', error: 'Incorrect username or password' });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPass = await bcrypt.hash(password, 12);

    db('users')
      .insert({ username, password: hashedPass })
      .then(() => {
        // Login immediately after succesfull register
        this.login(req, res);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ status: 'error', error: 'Error creating account' });
      });
  } catch (err) {
    res.status(500).json({ status: 'error', error: 'Error creating account' });
  }
};

exports.logout = (req, res) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    secure: false,
    httpOnly: true,
  };

  res.cookie('jwt', 'logged-out', cookieOptions);

  res
    .status(200)
    .json({ status: 'success', message: 'Logged out successfully' });
};

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.cookies.jwt && req.cookies.jwt !== 'logged-out') {
      token = req.cookies.jwt;
    }

    if (!token) {
      res
        .status(401)
        .json({ status: 'unauthorized', error: 'Log in to continue' });
    } else {
      next();
    }
  } catch (err) {
    res.status(500).json({ status: 'error', err });
  }
};

exports.isLoggedIn = async (req, res, next) => {
  try {
    let token;

    if (req.cookies.jwt && req.cookies.jwt !== 'logged-out') {
      token = req.cookies.jwt;
    }

    if (!token) {
      res.status(401).json({
        status: 'error',
        error: 'You are not logged in, please log in to continue',
      });
    } else {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      db.select()
        .from('users')
        .where('id', decoded.id)
        .then((data) => {
          res.status(200).json({ status: 'success', user: data[0] });
        })
        .catch((err) => {
          res.status(401).json({
            status: 'error',
            error: 'You are not logged in, please log in to continue',
          });
        });
    }
  } catch (err) {
    res.status(500).json({ status: 'error', err });
  }
};
