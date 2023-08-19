const publisher = require('../models/publisherModel');
const catchAsync = require('../utils/catchAsync');

exports.postpublisher = catchAsync(async (req, res, next) => {
    const newPublisher = await publisher.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            Publisher: newPublisher
        }
    });
})

exports.getpublisher = catchAsync(async (req, res, next) => {

    const data = await publisher.find()
        .populate({ path: 'booksPublished', select: 'name publishYear author' });
    res.status(200).json({ success: true, data });
})