const product = require('../../models/ManytoMany/productModel');
const catchAsync = require('../../utils/catchAsync');
const Category = require('../../models/ManytoMany/categoryModel');

exports.postproduct = catchAsync(async (req, res, next) => {
  console.log(req.body); //you will get your data in this as object.
  console.log(req.is('json'));
    const newProduct = await product.create(req.body);
    await Category.updateMany({ '_id': newProduct.categories }, { $push: { products: newProduct._id } });
    return res.send(newProduct);
})

exports.getproduct = catchAsync(async (req, res, next) => {

    const data = await product.find().populate({ path: 'categories', select: 'name' });
    res.status(200).json({ success: true, data });
})

exports.deleteproduct = catchAsync(async (req, res) => {
    const _id = req.params.id;
    const productid = await product.findOne({ _id });
    await product.findByIdAndDelete(_id);
    await Category.updateMany({ '_id': productid.categories }, { $pull: { products: productid._id } });
    return res.redirect(productid);
});

exports.putproduct = catchAsync(async (req, res)=> {
    const _id = req.params.id;
    const  productdata  = req.body;
    const newCategories = await productdata.categories || [];
    const oldProduct = await product.findOne({ _id });
    const oldCategories =await oldProduct.categories;

    Object.assign(oldProduct, productdata);
    const newProduct = await oldProduct.save();
    function difference(A, B) {
        const arrA = Array.isArray(A) ? A.map(x => x.toString()) : [A.toString()];
        const arrB = Array.isArray(B) ? B.map(x => x.toString()) : [B.toString()];
      
        const result = [];
        for (const p of arrA) {
          if (arrB.indexOf(p) === -1) {
            result.push(p);
          }
        }
        return result;
      }
    const added = difference(newCategories, oldCategories);
    const removed = difference(oldCategories, newCategories);
    await Category.updateMany({ '_id': added }, { $addToSet: { products: oldProduct._id } });
    await Category.updateMany({ '_id': removed }, { $pull: { products: oldProduct._id  } });
    return res.send(newProduct);
  });