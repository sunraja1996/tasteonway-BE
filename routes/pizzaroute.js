const express = require('express');
const router = express.Router();
const pbModel = require('../schema/pizzaburgers');

// router.get('/getallpizzaburgers', async(req, res)=>{
//     try {
//       let pizzaburger = await pbModel.find({});
//       res.send({statusCode:200, pizzaburger, message:"DATA Fetch Successfull"})
//     } catch (error) {
//       console.log(error);
//       res.send({statusCode:500, message:"Internal server Error"})
//     }
//   })

router.get('/allpizzaburgers', async(req, res) => {
  try {
    let pizzaburger = await pbModel.find({});
    res.send({
      statusCode: 200, 
      pizzaburger, 
      message: "Data Fetch Successful"
    });
  } catch (error) {
    console.log(error);
    res.send({ statusCode: 500, message: "Internal Server Error" });
  }
});

router.get('/getallpizzaburgers', async (req, res) => {
  const { category = "all", page = 1, limit = 10 } = req.query;
  
  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  let query = {};
  if (category !== "all") {
    query.category = category;
  }

  try {
    const pizzaburger = await pbModel.find(query)
      .skip(skip)
      .limit(limitNumber);
    const totalPizzas = await pbModel.countDocuments(query);
    const totalPages = Math.ceil(totalPizzas / limitNumber);

    res.send({
      statusCode: 200,
      pizzaburger,
      totalPages,
      message: "Data Fetch Successful"
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ statusCode: 500, message: "Internal Server Error" });
  }
});



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
        if (prices) {
        prices.forEach(p => {
          p.price = Number(p.price);
        });
      }
  
      console.log({ name, prices, category, image, description });
  
      if (!prices || prices.length !== 3 || prices.some(p => isNaN(p.price))) {
        return res.status(400).json({ error: 'All price fields (small, medium, large) must be filled and valid numbers.' });
      }
  
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
      console.error('Error adding product:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  
  
  
  
  

  module.exports = router;