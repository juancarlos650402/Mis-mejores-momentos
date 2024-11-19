const Album = require('../models/Album');
const Photo = require('../models/Photo');

// Crear álbum
exports.createAlbum = async (req, res) => {
  const { title, description } = req.body;
  const album = new Album({ title, description, userId: req.user._id });

  try {
    await album.save();
    res.redirect('/albums');
  } catch (err) {
    res.status(500).send('Error al crear el álbum');
  }
};

// Ver álbumes del usuario
exports.getAlbums = async (req, res) => {
  const albums = await Album.find({ userId: req.user._id });
  res.render('albums', { albums });
};
