// const mongoose = require('mongoose');

// const pizzaburgersSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   prices: [
//     {
//       size: { type: String, enum: ['small', 'medium', 'large'], required: true },
//       price: { type: Number, required: true },
//     },
//   ],
//   category: { type: String, required: true },
//   image: { type: String, required: true },
//   description: { type: String, required: true },
// });

// const pbModel = mongoose.model('pizzaburgers', pizzaburgersSchema);

// module.exports = pbModel;

const mongoose = require('mongoose');

const pizzaburgersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  prices: [
    {
      size: { type: String, enum: ['small', 'medium', 'large'], required: true },
      price: { type: Number, required: true },
    },
  ],
  category: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
});

const pbModel = mongoose.model('pizzaburgers', pizzaburgersSchema);

module.exports = pbModel;
