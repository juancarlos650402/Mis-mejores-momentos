const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const session = require('express-session');
const passport = require('./passport');
const User = require('./models/User');
const Photo = require('./models/Photo');
const path = require('path');

const app = express();

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para procesar formularios y JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurar sesión
app.use(session({
  secret: 'mi_secreto',
  resave: false,
  saveUninitialized: true,
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurar almacenamiento para subir imágenes (Multer)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Rutas existentes
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'views', 'register.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));

// Ruta principal para mostrar fotos
app.get('/', async (req, res) => {
  try {
    const photos = await Photo.find(); // Traer todas las fotos
    res.render('index', { photos }); // Pasar las fotos a la vista
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar las fotos');
  }
});

// Ruta protegida para el dashboard
app.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const photos = await Photo.find({ user: req.user._id });
    res.render('dashboard', { user: req.user, photos });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el dashboard');
  }
});

// Ruta para subir fotos
app.post('/photos/upload', isAuthenticated, upload.single('photo'), async (req, res) => {
  try {
    const newPhoto = new Photo({
      title: req.body.title,
      user: req.user._id,
      path: `/images/${req.file.filename}`,
    });
    await newPhoto.save();
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al subir la foto');
  }
});

// Rutas de autenticación
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).send('Todos los campos son requeridos');
  }

  try {
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.send('Usuario registrado con éxito');
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).send('Error al registrar el usuario');
  }
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
}));

// Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

// Conexión a MongoDB
mongoose.connect('mongodb://localhost/photo_album_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conexión a MongoDB exitosa');
  app.listen(3000, () => console.log('Servidor corriendo en el puerto 3000'));
}).catch((err) => console.log('Error de conexión a MongoDB:', err));
