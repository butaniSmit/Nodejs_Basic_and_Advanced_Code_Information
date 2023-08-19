const rolesModel = require('../models/rolesModel');
const catchAsync = require('../utils/catchAsync');

exports.addRole =  catchAsync(async (req, res) => {

    const role = req.body.role
    const permissions = req.body.permissions
    const newRole = await rolesModel.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            roles: newRole
        }
    });

})

exports.getAllRoles = catchAsync(async (req,res)=>{
    const roles = await rolesModel.find();
        //SEND RESPONCE
        res.status(200).json({
            status: 'success',
            result: roles.length,
            data: {
                roles
            }
        })
})
exports.deleteRole = catchAsync(async (req, res, next) => {
    const role = await rolesModel.findByIdAndDelete(req.params.id);
    if (!role) {
        return next(new AppError('No role found with that ID', 404))
    }
    res.status(200).json({
        status: 'Data Deleted successfully',
    });
});

exports.getRole = catchAsync(async (req, res, next) => {

    const role = await rolesModel.findById(req.params.id);
    if (!role) {
        return next(new AppError('No tour found with that ID', 404))
    }
    //tour.findOne({_id:req.params.id})
    res.status(200).json({
        status: 'success',
        data: {
            role
        }
    })
});

exports.editRole = catchAsync(async (req, res, next) => {
    const role = await rolesModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    if (!role) {
        return next(new AppError('No tour found with that ID', 404))
    }
    res.status(201).json({
        status: 'success',
        data: {
            role
        }
    });
});