const User = require('../models/User');
const passport = require('passport');
const bcrypt = require('bcryptjs');

// Registrar un usuario
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    res.status(500).send('Error en el registro');
  }
};

// Iniciar sesión
exports.login = passport.authenticate('local', {
  successRedirect: '/albums',
  failureRedirect: '/login',
  failureFlash: true
});

// Logout
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
};
