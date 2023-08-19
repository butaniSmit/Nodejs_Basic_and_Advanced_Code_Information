const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name:           { type: String, required: true,unique: true},
    price:          { type: Number, required: true, min: 0},
    categories:     [{ type: mongoose.Types.ObjectId, ref: 'Category' }],
});
module.exports = new mongoose.model('Product', productSchema);