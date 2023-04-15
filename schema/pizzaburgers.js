const mongoose = require("mongoose");

const pbschema = mongoose.Schema(
  {
    name: { type: String, required: true },
    variants: [],
    prices: [],
    category: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const pbModel = mongoose.model('pizzaburgers', pbschema)

module.exports = pbModel;
