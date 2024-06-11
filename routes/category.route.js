
var express = require('express');
const { getCategories, getCategory, createCategory, updateCategory, deleteCategory, getCategoriesWithoutPagination } = require('../controller/category.controller');
const upload = require('../services/multer');
var router = express.Router();

router.get('/', getCategories);
router.get('/all', getCategoriesWithoutPagination);
router.get('/:id', getCategory);
router.post('/add', upload.single("image"), createCategory);
router.put('/:id', upload.single("image"), updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
