const Photo = require('../models/Photo');

exports.getPhotos = async (req, res) => {
    try {
        const photos = await Photo.find({ user: req.user._id });
        res.render('dashboard', { photos });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener fotos');
    }
};

exports.uploadPhoto = async (req, res) => {
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
        res.status(500).send('Error al subir foto');
    }
};
