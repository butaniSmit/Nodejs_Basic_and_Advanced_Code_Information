
const multer = require('multer');
const sharp = require('sharp');
const User = require('./../models/userModel')
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

// Add this to the top of the file
// const { roles } = require('../roles')
 
exports.checkID = (req,res,next,val)=>{
    console.log(`Tour id is: ${val}`)
    // req.params.id * 1>tours.lenght
    // const tour = tours.find((el) => el.id === val);
    if(req.params.id * 1>'tours.lenght'){
      return res.status(404).json({
        status: 'fail',
        message: 'Invalid ID'
      })
    }
    next();
  }
  //upload file
  const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    // const ext = file.mimetype.split('/')[1];
    cb(null, `${file.originalname}`);
  }
});
  // const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpg' ||file.mimetype === 'image/jpeg'|| file.mimetype === 'application/pdf' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new AppError('Please upload only jpeg, jpg, png, pdf images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});
//   const  upload = multer({dest: 'public/img/users'});
  exports.uploadUserPhoto = upload.single('photo');

  // exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  //   if (!req.file) return next();
  
  //   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  
  //   await sharp(req.file.buffer)
  //     .resize(500, 500)
  //     .toFormat('jpeg')
  //     .jpeg({ quality: 90 })
  //     .toFile(`public/img/users/${req.file.filename}`);
  
  //   next();
  // });
  const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
  };
  exports.checkBody=(req,res,next) =>{
    if(!req.body.name || !req.body.price){
        return res.status(400).json({
            status: 'fail',
            message:'missing name or price'
        })
    }
    next();
  }
  exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
  };
  exports.getOne = factory.getOne(User);
  exports.deleteUser = factory.deleteOne(User);
  exports.updateUser = factory.updateOne(User);
  exports.updateMe = catchAsync(async (req, res, next) => {
    console.log(req)
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /updateMyPassword.',
          400
        )
      );
    }
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    if (req.file) filteredBody.photo = req.protocol + '://' + req.get('host') + '/'+ req.file.path;
    // if (req.file) filteredBody.photo = req.file.filename;

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true
    });
  
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  });

  exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
  
    res.status(200).json({
      status: 'success',
      data: null
    });
  });
exports.getAllUser = catchAsync(async (req,res)=>{
    const users = await User.find();
        //SEND RESPONCE
        res.status(200).json({
            status: 'success',
            result: users.length,
            data: {
                users
            }
        })
})