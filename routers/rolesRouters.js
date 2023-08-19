const express = require('express');
const Router = express.Router();
const rolesController = require('../controllers/roleController');

Router.route('/').get(rolesController.getAllRoles).post(rolesController.addRole)
Router.route('/:id').get(rolesController.getRole).delete(rolesController.deleteRole).patch(rolesController.editRole)

module.exports = Router;