
var express = require('express');
const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controller/category.controller');
const { getSubcategories, getSubCategory, createSubCategory, updateSubCategory, deleteSubCategory, getSubCategoriesByCategory } = require('../controller/sub-category.controller');
var router = express.Router();

router.get('/', getSubcategories);
router.get('/:id', getSubCategory);
router.get('/category/:categoryId', getSubCategoriesByCategory);
router.post('/add', createSubCategory);
router.put('/:id', updateSubCategory);
router.delete('/:id', deleteSubCategory);

module.exports = router;
