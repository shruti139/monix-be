const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    subcategory: { type: Schema.Types.ObjectId, ref: 'Subcategory' },
    imageType: { type: String, required: true },
    downloadCount: { type: Number, default: 0 },
    trending: { type: Boolean, default: false},
}, { timestamps: true });

module.exports = mongoose.model('Image', ImageSchema);
