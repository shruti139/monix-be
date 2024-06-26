const Image = require('../models/image.model');

// Get all images
const getImages = async (req, res) => {
    try {
        let filter = {}
        const { type, category, search, trending, recent, page, limit } = req?.query
        if (type) filter['imageType'] = type
        if (category) filter['category'] = category
        if (search) {
            const regex = new RegExp(search, 'i')
            filter = { ...filter, $or: [{ name: regex }, { "category.name": regex }, { "subcategory.name": regex }] }
        }
        let pipeline = { $match: {} }
        if (recent) {
            pipeline = { $sort: { createdAt: -1 } }
        }
        if (trending) {
            pipeline = { $sort: { downloadCount: -1 } }

        }
        const total = await Image.countDocuments(filter)
        console.log("🚀 ~ getImages ~ total:", total)
        const imagess = await Image.aggregate([

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
                }
            }
            ,

            { $match: filter },
            pipeline,

        ]).skip(parseInt(limit) * (parseInt(page) - 1)).limit(parseInt(limit)).exec()
        console.log("🚀 ~ getImages ~ parseInt(limit) * (parseInt(page) - 1):", parseInt(limit) * (parseInt(page) - 1))
        // const images = await Image.find(filter).populate([{ path: 'category', match: filter }, { path: 'subcategory', match: filter }])
        res.status(200).json({ imagess, message: "images fetched", success: true, total });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
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

// Create a new image
const createImage = async (req, res) => {
    const { category, subcategory, name, imageType } = req.body;
    const imagepath = req.files?.length ? req?.files?.map(file => file?.path) : null;
    try {
        const findImage = await Image.findOne({ name, category, subcategory });
        if (findImage) return res.status(404).json({ message: 'Image already found', success: false });
        const image = new Image({ image: imagepath, category, subcategory, name, imageType });
        const savedImage = await image.save();
        res.status(201).json({ image: savedImage, message: "image created", success: true });
    } catch (error) {
        res.status(400).json({ message: error.message, success: false });
    }
};
const updateImage = async (req, res) => {
    if (req.files?.length) {
        const path = req?.files?.map(file => file?.path)
        req.body.image = path;

    }
    console.log("🚀 ~ updateImage ~ req.body:", req.body, req?.files)
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
    updateImage
};
