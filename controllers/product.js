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

async function getProducts(search = "", limit = 10, page = 1, sort = "cheap") {
  let sortQuery;
  if (sort === "expensive") {
    sortQuery = [
      ["priceWithDiscount", -1],
      ["price", -1],
    ];
  } else {
    sortQuery = [
      ["priceWithDiscount", 1],
      ["price", 1],
    ];
  }

  const products = await Product.find({
    title: { $regex: search, $options: "i" },
  })
    .sort(sortQuery)
    .skip((page - 1) * limit)
    .limit(limit);

  const count = await Product.countDocuments({
    title: { $regex: search, $options: "i" },
  });

  const pagination = { lastPage: Math.ceil(count / limit), page, limit };

  return {
    products,
    pagination,
  };
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
