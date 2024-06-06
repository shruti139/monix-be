const express = require('express');
const router = express.Router();
const multer = require('multer');

// Multer configuration for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });


module.exports = upload;
