const express = require('express');
const publisher = require('../controllers/publisherController');

const Router = express.Router();

Router.route('/').get(publisher.getpublisher).post(publisher.postpublisher);

module.exports = Router;