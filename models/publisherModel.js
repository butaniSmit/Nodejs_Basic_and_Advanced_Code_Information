const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const publisherSchema = new Schema({
    name: String,
    location: String
},
    { timestamps: true }
);
publisherSchema.virtual('booksPublished', {
    ref: 'Book', //The Model to use
    localField: '_id', //Find in Model, where localField 
    foreignField: 'publisher', // is equal to foreignField
});
// Set Object and Json property to true. Default is set to false
publisherSchema.set('toObject', { virtuals: true });
publisherSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('publisher', publisherSchema);