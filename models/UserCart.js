const mongoose = require("mongoose");

const UserCartSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Подразумевается, что у тебя есть модель "User"
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Подразумевается, что у тебя есть модель "Product"
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

const UserCart = mongoose.model("UserCart", UserCartSchema);

module.exports = UserCart;
