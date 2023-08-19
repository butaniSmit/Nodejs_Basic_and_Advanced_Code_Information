const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const Router = express.Router();

// Router.param('id', tourController.checkID);
Router
    .route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTour);
Router.route('/tour-stats').get(tourController.getTourStats);
Router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

Router.route('/').get(authController.protect,authController.grantAccess("view-tour"), tourController.getAllTour)
    .post(tourController.postTour);
    
Router.route('/:id').get(tourController.getTour).patch(tourController.editTour).delete(authController.protect,tourController.deleteTour);

module.exports = Router;