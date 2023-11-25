const UserCart = require("../models/UserCart");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    let userCart = await UserCart.findOne({ userId });

    if (!userCart) {
      userCart = new UserCart({ userId, products: [{ productId, quantity }] });
    } else {
      const existingProductIndex = userCart.products.findIndex(
        (product) => product.productId.toString() === productId
      );

      if (existingProductIndex !== -1) {
        userCart.products[existingProductIndex].quantity += quantity;
      } else {
        userCart.products.push({ productId, quantity });
      }
    }

    await userCart.save();

    res.status(201).json({ message: "Товар успешно добавлен в корзину" });
    return; // Завершение функции после отправки ответа
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Произошла ошибка при добавлении товара в корзину" });
  }
};

const getCart = async (userId) => {
  try {
    const userCart = await UserCart.findOne({ userId });
    return userCart;
  } catch (error) {
    console.error(error);
    throw new Error("Произошла ошибка при получении корзины пользователя");
  }
};

module.exports = { addToCart, getCart };