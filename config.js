const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/photo_album_app')
  .then(() => console.log('Conexión a MongoDB exitosa'))
  .catch((err) => console.log('Error de conexión a MongoDB:', err));

  