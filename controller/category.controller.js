const Category = require('../models/category.model');

// Get all categories
const getCategories = async (req, res) => {
    try {
        const { limit, page } = req.query;
        const categories = await Category.find().limit(limit).skip(limit * (page - 1)).exec();
        res.status(200).json({ categories: categories, message: "Categories fetched", success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};
// Get all categories
const getCategoriesWithoutPagination = async (req, res) => {
    try {
        const { limit, page } = req.query;
        const categories = await Category.find();
        res.status(200).json({ categories: categories, message: "Categories fetched", success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// Get a single category by ID
const getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
        if (!category) return res.status(404).json({ message: 'Category not found', success: false });
        res.status(200).json({ category, message: "Category fetched", success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new category
const createCategory = async (req, res) => {
    if (req?.file) {
        req.body.image = req?.file?.path
    }
    const { name, image } = req.body;
    try {
        const findcategory = await Category.findOne({ name });
        if (findcategory) return res.status(404).json({ message: 'Category already found', success: false });
        const category = new Category({ name, image });
        const savedCategory = await category.save();
        res.status(201).json({ category: savedCategory, message: "Category created", success: true });
    } catch (error) {
        res.status(400).json({ message: error.message, success: false });
    }
};

// Update a category
const updateCategory = async (req, res) => {
    if (req?.file) {
        req.body.image = req?.file?.path
    }
    const { name, image } = req.body;
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found', success: false });

        category.name = name || category.name;
        category.image = req.body.image || category.image;


        const updatedCategory = await category.save();
        res.status(200).json({ category: updatedCategory, "message": "Category updated", success: true });
    } catch (error) {
        res.status(400).json({ message: error.message, success: false });
    }
};

// Delete a category
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found', success: false });

        await Category.findByIdAndDelete(req.params.id).exec();
        res.status(200).json({ message: 'Category deleted', success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoriesWithoutPagination
};
