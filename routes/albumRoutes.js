const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');

router.post('/create', albumController.createAlbum);
router.get('/', albumController.getAlbums);

module.exports = router;
