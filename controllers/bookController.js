const Book = require('../models/bookModel');
const publisher = require('../models/publisherModel')
const catchAsync = require('../utils/catchAsync');

exports.postbook = catchAsync(async (req, res, next) => {

    const book = await Book.create(req.body);
    // book.publisher = publisher._id; <=== Assign user id from signed in publisher to publisher key
    await book.save();
    // const publi = await publisher.findById({_id: book.publisher._id})
    //  await publi.publishedBooks.push(book);
    //   await publi.save();

    //return new book object, after saving it to Publisher
    res.status(200).json({success:true, data: book })
})