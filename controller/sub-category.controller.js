const Subcategory = require('../models/sub-category.model');

// Get all subcategories
const getSubcategories = async (req, res) => {
    try {
        const subcategories = await Subcategory.find().populate('category');
        res.status(200).json({ subcategories: subcategories, message: "Subcategories fetched" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single subcategories by ID
const getSubCategory = async (req, res) => {
    try {
        const subcategories = await Subcategory.findById(req?.params?.id).populate('category');
        if (!subcategories) return res.status(404).json({ message: 'Subcategory not found' });
        res.status(200).json({ subcategory: subcategories, message: "Subcategory fetched" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSubCategoriesByCategory = async (req, res) => {
    try {
        const subcategories = await Subcategory.find({ category: req?.params?.categoryId }).populate('category');
        if (!subcategories) return res.status(404).json({ message: 'Subcategory not found' });
        res.status(200).json({ subcategory: subcategories, message: "Subcategory fetched" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Create a new subcategories
const createSubCategory = async (req, res) => {
    const { name, category } = req.body;
    try {
        const findSubCategory = await Subcategory.findOne({ name });
        if (findSubCategory) return res.status(404).json({ message: 'Sub-Category found' });
        const subcategories = new Subcategory({ name, category });
        const savedCategory = await subcategories.save();
        res.status(201).json({ subcategory: savedCategory, message: "Subcategory created" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a subcategories
const updateSubCategory = async (req, res) => {
    const { name, category } = req.body;
    try {
        const subcategories = await Subcategory.findById(req.params.id);
        if (!subcategories) return res.status(404).json({ message: 'Subcategory not found' });

        subcategories.name = name || subcategories?.name;
        subcategories.category = category || subcategories?.category;

        const updatedCategory = await subcategories.save();
        res.status(200).json({ subcategory: updatedCategory, message: "Subcategory updated" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a subcategories
const deleteSubCategory = async (req, res) => {
    try {
        const subcategories = await Subcategory.findById(req.params.id);
        if (!subcategories) return res.status(404).json({ message: 'Subcategory not found' });

        await Subcategory.findByIdAndDelete(req.params.id).exec();
        res.status(200).json({ message: 'Subcategory deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSubcategories,
    getSubCategory,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
    getSubCategoriesByCategory
};
