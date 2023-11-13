const mongoose = require("mongoose");

module.exports = function (products) {
  return {
    id: products.id,
    title: products.title,
    price: products.price,
    imageUrl: products.imageUrl,
    category: products.category,
    sale: products.sale,
  };
};
