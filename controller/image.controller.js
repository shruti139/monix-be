const mongoose = require('mongoose');
const Image = require('../models/image.model');
const categoryModel = require('../models/category.model');
const subCategoryModel = require('../models/sub-category.model');

// Get all images
const getImages = async (req, res) => {
    try {
        let filter = {};
        let categoryFilter = {};
        const { type, category, search, trending, recent, page, limit, subcategory } = req?.query;
        if (type) filter['imageType'] = type;
        if (category) categoryFilter['category'] = new mongoose.Types.ObjectId(category);
        if (subcategory) categoryFilter['subcategory'] = new mongoose.Types.ObjectId(subcategory);
        if (search) {
            const regex = new RegExp(search, 'i');
            filter = { ...filter, $or: [{ name: regex }, { "category.name": regex }, { "subcategory.name": regex }] };
        }
        let pipeline = { $match: {} };
        if (recent) {
            pipeline = { $sort: { createdAt: -1 } };
        }
        if (trending) {
            pipeline = { $sort: { trending: -1, downloadCount: -1 } };  // Sort by trending and downloadCount
        } else {
            pipeline = { $sort: { downloadCount: -1 } };  // Default sort by downloadCount
        }
        const total = await Image.countDocuments(filter);
        const imagess = await Image.aggregate([
            { $match: categoryFilter },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                }
            },
            {
                $unwind: {
                    path: '$category',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'category._id',
                    foreignField: 'category',
                    as: 'subcategory',
                }
            },
            {
                $unwind: {
                    path: '$subcategory',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    image: { $first: "$image" },
                    category: { $first: "$category" },
                    subcategory: { $first: "$subcategory" },
                    imageType: { $first: "$imageType" },
                    downloadCount: { $first: "$downloadCount" },
                    trending: { $first: "$trending" }
                }
            },
            { $match: filter },
            pipeline,
        ]).skip(parseInt(limit) * (parseInt(page) - 1)).limit(parseInt(limit)).exec();
        // const images = await Image.find(filter).populate([{ path: 'category', match: filter }, { path: 'subcategory', match: filter }])
        res.status(200).json({ imagess, message: "images fetched", success: true, total });
    } catch (error) {
        res.status (500).json({ message: error.message, success: false });
    }
};


// Get a single image by ID
const getImage = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id).populate(['category', 'subcategory']);
        if (!image) return res.status(404).json({ message: 'Image not found', success: false });
        res.status(200).json({ image, message: "image fetched", success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};
const getSearchResult = async (req, res) => {
    try {
        const search = req.query.search;
        const regex = new RegExp(search, 'i');
        const category = await categoryModel.find({ name: regex })
        const subcategory = await subCategoryModel.find({ name: regex })

        res.status(200).json({ data: { category, subcategory }, message: "Result fetched", success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// Create a new image
const createImage = async (req, res) => {
    const { category, subcategory, name, imageType, trending } = req.body;
    try {


        for (const file of req.files) {
            const imagepath = file.path;
            const image = new Image({ image: imagepath, category, subcategory, name, imageType, trending }); // Add trending here
            await image.save();
        }

        res.status(201).json({ message: "image created", success: true});
    } catch (error) {
        console.error("Error creating image:", error); // Log any errors
        res.status(400).json({ message: error.message, success: false });
    }
};


const updateImage = async (req, res) => {
    if (req.files?.length) {
        const path = req?.files?.map(file => file?.path)
        req.body.image = path;

    }
    try {
        const savedImage = await Image.findByIdAndUpdate(req?.params?.id, req?.body, { new: true });
        res.status(201).json({ image: savedImage, message: "image updated", success: true });
    } catch (error) {
        res.status(400).json({ message: error.message, success: false });
    }
};

// Delete an image
const deleteImage = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) return res.status(404).json({ message: 'Image not found', success: false });

        await Image.findByIdAndDelete(req.params.id).exec();
        res.status(200).json({ message: 'Image deleted', success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

const incrementDownloadCount = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) return res.status(404).json({ message: 'Image not found', success: false });

        image.downloadCount += 1;
        await image.save();

        res.status(200).json({ message: 'Download count incremented', downloadCount: image.downloadCount, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

module.exports = {
    getImages,
    getImage,
    createImage,
    deleteImage,
    incrementDownloadCount,
    updateImage,
    getSearchResult
};
