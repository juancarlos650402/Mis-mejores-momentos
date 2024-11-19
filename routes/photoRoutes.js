const express = require('express');
const multer = require('multer');
const photoController = require('../controllers/photoController');
const { isAuthenticated } = require('../middlewares/auth');

const router = express.Router();

// Configurar Multer para subir fotos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({ storage });

// Rutas
router.get('/dashboard', isAuthenticated, photoController.getPhotos);
router.post('/photos/upload', isAuthenticated, upload.single('photo'), photoController.uploadPhoto);

module.exports = router;
