const mongoose = require('mongoose')
require('dotenv').config();

const dbUrl = process.env.MONGO_URL;


module.exports ={dbUrl,mongoose}