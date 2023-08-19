const express = require('express');
const category = require('../../controllers/ManytoMany/categoryController');

const Router = express.Router();

Router.route('/').post(category.postcategory).get(category.getcategory);

module.exports = Router;