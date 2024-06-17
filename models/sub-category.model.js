const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubcategorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    image: { type: String, required: true },

}, { timestamps: true });

module.exports = mongoose.model('Subcategory', SubcategorySchema);
