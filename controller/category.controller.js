const Category = require('../models/category.model');

// Get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find()
        res.status(200).json({ categories: categories, message: "Categories fetched" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single category by ID
const getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json({ category, message: "Category fetched" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new category
const createCategory = async (req, res) => {
    const { name } = req.body;
    try {
        const findcategory = await Category.findOne({ name });
        if (findcategory) return res.status(404).json({ message: 'Category already found' });
        const category = new Category({ name });
        const savedCategory = await category.save();
        res.status(201).json({ category: savedCategory, message: "Category created" });
    } catch (error) {
        console.log("🚀 ~ createCategory ~ error:", error)
        res.status(400).json({ message: error.message });
    }
};

// Update a category
const updateCategory = async (req, res) => {
    const { name, subcategories } = req.body;
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        category.name = name || category.name;


        const updatedCategory = await category.save();
        res.status(200).json({ category: updatedCategory, "message": "Category updated" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a category
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        await Category.findByIdAndDelete(req.params.id).exec();
        res.status(200).json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
};
