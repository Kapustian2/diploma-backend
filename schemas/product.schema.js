const ProductSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
    },
    price: {
      type: "number",
    },
    imageUrl: {
      type: "string",
    },
    category: {
      type: "string",
    },
    sale: {
      type: "number",
    },
  },
};

const createProductSchema = {
  ...ProductSchema,
  required: ["title", "price", "imageUrl", "category"],
};

const updateProductSchema = {
  ...ProductSchema,
  minProperties: 1,
  additionalProperties: false,
};

module.exports = {
  createProductSchema,
  updateProductSchema,
};
