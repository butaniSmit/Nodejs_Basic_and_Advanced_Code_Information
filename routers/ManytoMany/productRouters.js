const express = require('express');
const product = require('../../controllers/ManytoMany/productController');

const Router = express.Router();

Router.route('/').get(product.getproduct).post(product.postproduct);
Router.route('/:id').get(product.getproduct).delete(product.deleteproduct).patch(product.putproduct);

module.exports = Router;