const express = require('express');
const router = express.Router();
const pbModel = require('../schema/pizzaburgers');

router.get('/getallpizzaburgers', async(req, res)=>{
    try {
      let pizzaburger = await pbModel.find({});
      res.send({statusCode:200, pizzaburger, message:"DATA Fetch Successfull"})
    } catch (error) {
      console.log(error);
      res.send({statusCode:500, message:"Internal server Error"})
    }
  })


  router.delete('/delete-product/:id', async (req, res) => {
    try {
      const deletedproduct = await pbModel.findOneAndDelete({_id: req.params.id});
  
      if (!deletedproduct) {
        return res
          .status(404)
          .send({ statusCode: 404, message: "Product not found" });
      }
  
      res.send({
        statusCode: 200,
        user: deletedproduct,
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.send({ statusCode: 500, message: "Internal server error" });
    }
  });



  router.post("/addproduct", async (req, res) => {
    try {
      const { name, prices, category, image, description } = req.body;
  
      const newProduct = new pbModel({
        name,
        prices,
        category,
        image,
        description,
      });
  
      const savedProduct = await newProduct.save();
  
      res.json(savedProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  

  module.exports = router;