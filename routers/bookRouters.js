const express = require('express');
const Book = require('../controllers/bookController');

const Router = express.Router();

Router.route('/').post(Book.postbook);

module.exports = Router;