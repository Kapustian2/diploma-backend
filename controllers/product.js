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

async function getProducts(
  search = "",
  limit = 10,
  page = 1,
  sort = "cheap",
  category = "",
  showSale = ""
) {
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

  const query = {
    title: { $regex: search, $options: "i" },
  };

  if (showSale) {
    query.sale = { $gt: 0 };
  }

  if (category) {
    query.category = category;
  }

  const products = await Product.find(query)
    .sort(sortQuery)
    .skip((page - 1) * limit)
    .limit(limit);

  const count = await Product.countDocuments(query);

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
