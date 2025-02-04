const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { dbUrl } = require('../config/db');
const pbModel = require('../schema/pizzaburgers');

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on('error', (err) => {
  console.log(err);
});

router.get('/getpbs', async(req, res)=>{
  try {
    let docs = await pbModel.find({});
    res.send({statusCode:200, docs, message:"DATA Fetch Successfull"})
  } catch (error) {
    console.log(error);
    res.send({statusCode:500, message:"Internal server Error"})
  }
})



router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
