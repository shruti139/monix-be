
var express = require('express');
const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controller/category.controller');
var router = express.Router();

router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/add', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;