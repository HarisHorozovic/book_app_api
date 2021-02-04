const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = require('../database');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await db.select().from('users').where('username', username);

    const validLogin = await bcrypt.compare(password, user[0].password);

    if (!validLogin) {
      res
        .status(500)
        .json({ status: 'error', data: 'Incorrect username or password' });
    } else {
      const token = jwt.sign({ id: user[0].id }, 'supersecretjwtsecret', {
        expiresIn: '7 days',
      });

      res.status(200).json({ status: 'success', data: user[0], token });
    }
  } catch (err) {
    res.status(500).json({ status: 'error', err });
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
          .json({ status: 'error', data: 'Error creating account' });
      });
  } catch (err) {
    res.status(500).json({ status: 'error', data: 'Error creating account' });
  }
};
