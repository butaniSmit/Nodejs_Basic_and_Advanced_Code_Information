const fs = require('fs');
const cors= require('cors');
const express = require('express');
const morgan = require('morgan');
var bodyParser = require('body-parser');
const globalErrorHandler = require('./controllers/errorController')
const userRouter = require('./routers/userRouters');
const tourRouter = require('./routers/tourRouters');
const publisherRouter = require('./routers/publisherRouters');
const bookRouter = require('./routers/bookRouters');
const roles = require('./routers/rolesRouters');
const product = require('./routers/ManytoMany/productRouters');
const category = require('./routers/ManytoMany/categoryRouters');
const AppError = require('./utils/appError');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//midalwares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000'],
  methods:["GET",'POST'],
  AllowHeaders: ["X-Requested-With","Content-Type"],
  credentials: true
}))
app.use(express.static(`${__dirname}`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello from the server side!', app: 'Natours' });
});

app.post('/', (req, res) => {
  res.send('You can post to this endpoint...');
});
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//Get data
app.get('/api/v1/tours', (req, res) => {
  console.log(tours.lenght);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.lenght,
    data: {
      tours,
    },
  });
});

//Post data
app.post('/api/v1/tours', (req, res) => {
  // const newId = tours[tours.lenght - 1].id + 1;
  const newTour = Object.assign({ id: 9 }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          newTour,
        },
      });
    }
  );
});

//Get Data by id
app.get('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

//Update Data by id
app.patch('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

//Delete
app.delete('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

//Refactoring our routes 2 method
const getTours = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
}
//route
app.get('/api/v1/tours', getTours);

//3 method
app.route('/api/v1/tours').get(getTours).post(getTours);
app.route('/api/v1/tours/:id').get(getTours).patch(getTours).delete(getTours);

//4 method
const toursRouter = express.Router();
toursRouter.route('/').get(getTours).post(getTours);
toursRouter.route('/:id').get(getTours).patch(getTours).delete(getTours);
app.use('/api/v1/tours', toursRouter);

// create router file userRouter.js
app.use('/api/v1/user', userRouter);
app.use('/api/v1/tour', tourRouter);
app.use('/api/v1/publisher',publisherRouter);
app.use('/api/v1/book',bookRouter);
app.use('/api/v1/product',product);
app.use('/api/v1/category',category);
app.use('/api/v1/roles',roles);

app.all('*', (req, res, next) => {
  //1) method
  // res.status(404).json({
  //   status:'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`
  // })

  //2)method
  // const err= new Error(`Can't find ${req.originalUrl} on this server!`)
  // err.status ='fail';
  // err.statusCode = 404;
  // next(err);

  //3) method
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//1)method
// app.use((err,req,res,next)=>{
//   err.statusCode = err.statusCode || 500;
//   err.status =err.status ||  'error'

//   res.status(err.statusCode).json({
//     status: err.status,
//     message:err.message
//   });
// })

// 2) method
app.use(globalErrorHandler);

module.exports = app;