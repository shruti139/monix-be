

var express = require('express');
const { getImages, getImage, createImage, deleteImage, incrementDownloadCount, updateImage, getSearchResult } = require('../controller/image.controller');
const upload = require('../services/multer');
var router = express.Router();

// Image routes
router.get('/', getImages);
router.get('/search', getSearchResult);
router.get('/:id', getImage);
router.post('/add', upload.any('image'), createImage);
router.delete('/:id', deleteImage);
router.put('/:id', upload.single('image'), updateImage);
router.patch('/:id/incrementDownloadCount', incrementDownloadCount);
module.exports = router;
