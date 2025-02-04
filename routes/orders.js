const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require('uuid');
const {Order} = require('../schema/orderSchema')

router.post('/placeorders', async (req, res) => {
  const { token, total, firstName , cartItems } = req.body;
  console.log(req.body);

  if(process.env.STRIPE_COUNTRY === 'IN') {
    res.status(400).json({ message: 'Stripe payments are not supported in India' });
    console.log('Stripe payments are not supported in India');
    return;
  }

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const paymentIntent = await stripe.paymentIntents.create({
          amount: total * 100,
          currency: 'inr',
          customer: customer.id,
          receipt_email: token.email
        },
        {
          idempotencyKey: uuidv4(),
        },
      
    );
   
    if(paymentIntent){
      const userid = token.customer ? token.customer.id : null;

      const newOrder = new Order({
        name : firstName,
        email : token.email,
        userid : token.id,
        orderItems : cartItems,
        orderAmount : total,
        shippingAddress : {
          area : token.card.address_city,
          city : token.card.address_line1,
          country : token.card.address_country,
          pincode : token.card.address_zip,
          
        },
        transactionId : paymentIntent.source ? paymentIntent.source.id : null
      })

      newOrder.save()

      res.send({statuscode:200, message:"Order Placed Successfully"})
    }else{
      res.send({statuscode:400, message:"Payment Failed"})
    }

    
  } catch (error) {
    console.error(error);
    res.send({statuscode:500, message:"Internal Server Error"})
  }
});


router.get("/getuserorders", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const Orders = await Order.find({ userid: token.id });
    console.log(Orders);
    res.send({ statusCode: 200, orders: Orders });
  } catch (error) {
    res.send({ statusCode: 500, message: "Internal Server Error" });
  }
});


module.exports = router;



