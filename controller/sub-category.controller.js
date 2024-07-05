const Subcategory = require('../models/sub-category.model');

// Get all subcategories
const getSubcategories = async (req, res) => {
    try {
        const subcategories = await Subcategory.find().populate('category');
        res.status(200).json({ subcategories: subcategories, message: "Subcategories fetched", success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// Get a single subcategories by ID
const getSubCategory = async (req, res) => {
    try {
        const subcategories = await Subcategory.findById(req?.params?.id).populate('category');
        if (!subcategories) return res.status(404).json({ message: 'Subcategory not found', success: false });
        res.status(200).json({ subcategory: subcategories, message: "Subcategory fetched", success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

const getSubCategoriesByCategory = async (req, res) => {
    try {
        const subcategories = await Subcategory.find({ category: req?.params?.categoryId }).populate('category');
        if (!subcategories) return res.status(404).json({ message: 'Subcategory not found', success: false });
        res.status(200).json({ subcategory: subcategories, message: "Subcategory fetched", success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
}

// Create a new subcategories
const createSubCategory = async (req, res) => {
    console.log("🚀 ~ createSubCategory ~ req?.file:", req?.file)
    if (req?.file) {
        req.body.image = req?.file?.path
    }
    const { name, category, image } = req.body;
    console.log("🚀 ~ createSubCategory ~ image:", image)
    try {
        const findSubCategory = await Subcategory.findOne({ name });
        if (findSubCategory) return res.status(404).json({ message: 'Sub-Category found', success: false });
        const subcategories = new Subcategory({ name, category, image });
        const savedCategory = await subcategories.save();
        res.status(201).json({ subcategory: savedCategory, message: "Subcategory created", success: true });
    } catch (error) {
        res.status(400).json({ message: error.message, success: false });
    }
};

// Update a subcategories
const updateSubCategory = async (req, res) => {
    if (req?.file) {
        req.body.image = req?.file?.path
    }
    const { name, category } = req.body;
    try {
        const subcategories = await Subcategory.findById(req.params.id);
        if (!subcategories) return res.status(404).json({ message: 'Subcategory not found', success: false });

        subcategories.name = name || subcategories?.name;
        subcategories.category = category || subcategories?.category;
        subcategories.image = req.body.image || subcategories?.image;

        const updatedCategory = await subcategories.save();
        res.status(200).json({ subcategory: updatedCategory, message: "Subcategory updated", success: true });
    } catch (error) {
        res.status(400).json({ message: error.message, success: false });
    }
};

// Delete a subcategories
const deleteSubCategory = async (req, res) => {
    try {
        const subcategories = await Subcategory.findById(req.params.id);
        if (!subcategories) return res.status(404).json({ message: 'Subcategory not found', success: false });

        await Subcategory.findByIdAndDelete(req.params.id).exec();
        res.status(200).json({ message: 'Subcategory deleted', success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
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
