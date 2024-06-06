const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubcategorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' }
}, { timestamps: true });

module.exports = mongoose.model('Subcategory', SubcategorySchema);
