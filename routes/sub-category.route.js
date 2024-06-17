
var express = require('express');
const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controller/category.controller');
const { getSubcategories, getSubCategory, createSubCategory, updateSubCategory, deleteSubCategory, getSubCategoriesByCategory } = require('../controller/sub-category.controller');
const upload = require('../services/multer');
var router = express.Router();

router.get('/', getSubcategories);
router.get('/:id', getSubCategory);
router.get('/category/:categoryId', getSubCategoriesByCategory);
router.post('/add', upload.single("image"), createSubCategory);
router.put('/:id', upload.single("image"), updateSubCategory);
router.delete('/:id', deleteSubCategory);

module.exports = router;
