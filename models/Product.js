const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    sale: {
      type: Number,
      default: 0,
    },
    priceWithDiscount: {
      type: Number,
      default: function () {
        return (this.price * (100 - this.sale)) / 100;
      },
    },
  },
  { timestamps: true }
);
const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
