const Product = require("../models/Product");

// add

async function addProduct(product) {
  const newProduct = await Product.create(product);

  return newProduct;
}

// delete
function deleteProduct(id) {
  return Product.deleteOne({ _id: id });
}

// change

async function editProduct(id, product) {
  const newProduct = await Product.findByIdAndUpdate(id, product, {
    returnDocument: "after",
  });
  return newProduct;
}

// get

function getProducts() {
  return Product.find();
}

// get item
function getProduct(id) {
  return Product.findById(id);
}

module.exports = {
  addProduct,
  getProducts,
  getProduct,
  deleteProduct,
  editProduct,
};
