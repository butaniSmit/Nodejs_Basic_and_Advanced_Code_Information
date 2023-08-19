const Category = require('../../models/ManytoMany/categoryModel');
const catchAsync = require('../../utils/catchAsync');
const product = require('../../models/ManytoMany/productModel');
exports.postcategory = catchAsync(async (req, res, next) => {

    const category = await Category.create(req.body);
    await product.updateMany({ '_id': category.products }, { $push: { categories: category._id } });
    await category.save();

    res.status(200).json({success:true, data: category })
})

exports.getcategory = catchAsync(async (req, res, next) => {

    const data = await Category.find().populate({ path: 'products', select: 'name' });
    res.status(200).json({ success: true, data });
})