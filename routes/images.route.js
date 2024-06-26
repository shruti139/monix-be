

var express = require('express');
const { getImages, getImage, createImage, deleteImage, incrementDownloadCount, updateImage } = require('../controller/image.controller');
const upload = require('../services/multer');
var router = express.Router();

// Image routes
router.get('/', getImages);
router.get('/:id', getImage);
router.post('/add', upload.any('image'), createImage);
router.delete('/:id', deleteImage);
router.put('/:id', upload.any('image'), updateImage);
router.patch('/:id/incrementDownloadCount', incrementDownloadCount);
module.exports = router;
