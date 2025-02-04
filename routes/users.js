var express = require('express');
const {mongoose} = require('mongoose');
const {dbUrl} = require('../config/db');
const {userModel} = require ('../schema/userSchema');
const {hashPassword, hashCompare, createToken, decodeToken, validate, roleAdmin,roleUser} = require('../config/auth')


var router = express.Router();

mongoose.connect(dbUrl,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));


router.get('/all-users', validate, roleAdmin, async(req, res)=>{
  try {
    let users = await userModel.find({}, {password:0});
    res.send({statusCode:200, users, message:"DATA Fetch Successfull"})
  } catch (error) {
    console.log(error);
    res.send({statusCode:500, message:"Internal server Error"})
  }
})


// Register
router.post('/signup', async(req, res)=>{
  try {
    let user = await userModel.findOne({email:req.body.email})
    if(!user){
      let hashedPassword = await hashPassword(req.body.password)
      let data = {
          firstName : req.body.firstName,
          lastName : req.body.lastName,
          email : req.body.email,
          password : hashedPassword, 
      } 

      await userModel.create(data)


      res.send({statusCode:200, message:"User Signup Successful"})

    }else
      res.send({statusCode:400, message:"User already exists"})
    

  } catch (error) {
    console.log(error);
    res.send({statusCode:500, message:"Internal server Error"})
  }
})


router.post('/login', async(req, res)=>{
  try {

    let user = await userModel.findOne({email:req.body.email})

    if (user) {
      if(await hashCompare(req.body.password, user.password))
      {
        let token = await createToken(user)
        if (user.role === 'admin') {

          res.send({statusCode:200, message:"Admin Login Successful", role: 'admin', token})

        } else if (user.role === 'user') {

          res.send({
            statusCode: 200,
            message: "User Login Successful",
            role: 'user',
            token,
            firstName: user.firstName
          });


        } else {
          res.send({statusCode:400, message:"Invalid Role"})
        }
      }

      else
        res.send({statusCode:400, message:"Invalid Crediantials"})
      

    }
    else 
    
      res.send({statusCode:400, message:"User doesnot exists"})
    

  
  } catch (error) {
    console.log(error);
    res.send({statusCode:500, message:"Internal server Error"})
  }
})


router.put('/update-user/:id', async (req, res) => {
  try {
 
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
      
    );

    console.log(updatedUser);
    
    if (!updatedUser) {
      return res
        .status(404)
        .send({ statusCode: 404, message: "User not found" });
    }

    res.send({
      statusCode: 200,
      user: updatedUser,
      message: "User updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.send({ statusCode: 500, message: "Internal server error" });
  }
});



router.delete('/delete-user/:id', async (req, res) => {
  try {
    const deletedUser = await userModel.findOneAndDelete({_id: req.params.id});

    if (!deletedUser) {
      return res
        .status(404)
        .send({ statusCode: 404, message: "User not found" });
    }

    res.send({
      statusCode: 200,
      user: deletedUser,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.send({ statusCode: 500, message: "Internal server error" });
  }
});


router.post('/adduser', async (req, res) => {
  try {
    const { firstName, lastName, role, email, password } = req.body;

    // Check if user with given email already exists
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .send({ statusCode: 400, message: "User already exists" });
    }

    // Create new user object
    const newUser = new userModel({
      firstName,
      lastName,
      role,
      email,
      password
    });

    // Save new user to the database
    const savedUser = await newUser.save();

    res.send({
      statusCode: 200,
      user: savedUser,
      message: "User added successfully",
    });
  } catch (error) {
    console.log(error);
    res.send({ statusCode: 500, message: "Internal server error" });
  }
});



module.exports = router;
