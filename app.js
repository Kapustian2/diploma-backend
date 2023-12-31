require("dotenv").config();

const express = require("express");
const {
  Validator,
  ValidationError,
} = require("express-json-validator-middleware");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { register, login, getUsers, updateUser } = require("./controllers/user");
const mapUser = require("./helpers/mapUser");
const hasRole = require("./middlewares/hasRole");
const authenticated = require("./middlewares/authenticated");
const ROLES = require("./constants/roles");
const mapProducts = require("./helpers/mapProducts");
const {
  addProduct,
  getProducts,
  editProduct,
  deleteProduct,
  getProduct,
} = require("./controllers/product");
const {
  createProductSchema,
  updateProductSchema,
} = require("./schemas/product.schema");
const { createUserSchema, updateUserSchema } = require("./schemas/user.schema");
const { addToCart, getCart, deleteCart } = require("./controllers/userCart");

const { validate } = new Validator();

const port = 3001;

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.use(express.static("../frontend/build"));

app.use(cookieParser());
app.use(express.json());

app.post(
  "/register",
  validate({ body: createUserSchema }),
  async (req, res) => {
    try {
      const { user, token } = await register(req.body.login, req.body.password);

      res
        .cookie("token", token, { httpOnly: true })
        .send({ error: null, user: mapUser(user) });
    } catch (e) {
      res.send({ error: e.message || "Unknown error" });
    }
  }
);

app.post("/login", async (req, res) => {
  try {
    const { user, token } = await login(req.body.login, req.body.password);

    res
      .cookie("token", token, { httpOnly: true })
      .send({ error: null, user: mapUser(user) });
  } catch (e) {
    res.send({ error: e.message || "Unknown error" });
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true }).send({});
});

app.get("/products", async (req, res) => {
  const result = await getProducts(
    req.query.search,
    req.query.limit,
    req.query.page,
    req.query.sort,
    req.query.category,
    req.query.sale
  );
  res.send({
    data: result.products.map(mapProducts),
    pagination: result.pagination,
  });
});

app.get("/products/:id", async (req, res) => {
  const product = await getProduct(req.params.id);
  res.send({ data: mapProducts(product) });
});

app.use(authenticated);

app.get("/users", hasRole([ROLES.ADMIN]), async (req, res) => {
  const users = await getUsers();
  res.send({ data: users.map(mapUser) });
});

app.get("/users/roles", hasRole([ROLES.ADMIN]), async (req, res) => {
  const roles = getRoles();
  res.send({ data: roles });
});

app.patch(
  "/users/:id",
  validate({ body: updateUserSchema }),
  hasRole([ROLES.ADMIN]),
  async (req, res) => {
    const newUser = await updateUser(req.params.id, req.body);
    res.send({ data: mapUser(newUser) });
  }
);

app.delete("/users/:id", hasRole([ROLES.ADMIN]), async (req, res) => {
  await deleteUser(req.params.id);

  res.send({ error: null });
});

app.post(
  "/products",
  validate({ body: createProductSchema }),
  hasRole([ROLES.ADMIN]),
  async (req, res) => {
    const newProducts = await addProduct(req.body);

    res.send({ data: mapProducts(newProducts) });
  }
);

app.patch(
  "/products/:id",
  validate({ body: updateProductSchema }),
  hasRole([ROLES.ADMIN]),
  async (req, res) => {
    const updatedProduct = await editProduct(req.params.id, req.body);

    res.send({ data: mapProducts(updatedProduct) });
  }
);

app.delete("/products/:id", hasRole([ROLES.ADMIN]), async (req, res) => {
  await deleteProduct(req.params.id);

  res.send({ error: null });
});

app.use((error, req, res, next) => {
  if (error instanceof ValidationError) {
    res.status(400).send(error.validationErrors);
    next();
  } else {
    res.status(500).send("Unhandler error");
    next(error);
  }
});

app.post("/addtocart", async (req, res, next) => {
  await addToCart(req, res);
  next();
});

app.get("/cart/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const userCart = await getCart(userId);

    if (userCart) {
      res.status(200).json({ data: userCart });
    } else {
      res.status(404).json({ error: "Корзина пользователя не найдена" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Произошла ошибка при получении корзины пользователя" });
  }
});

app.delete("/cart/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.body.productId;

    const result = await deleteCart(userId, productId);

    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Произошла ошибка при удалении товара из корзины" });
  }
});

mongoose.connect(process.env.DB_CONNECTION_STRING).then(() =>
  app.listen(port, () => {
    console.log(`Server started! on port ${port}`);
  })
);
