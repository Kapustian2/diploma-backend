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

const deleteCart = async (userId, productId, res) => {
  try {
    let userCart = await UserCart.findOne({ userId });

    if (!userCart) {
      return res
        .status(404)
        .json({ message: "Корзина пользователя не найдена" });
    }

    const productIndex = userCart.products.findIndex(
      (product) => product.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Товар не найден в корзине" });
    }

    userCart.products.splice(productIndex, 1);

    await userCart.save();

    return true;
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Произошла ошибка при удалении товара из корзины" });
    return false;
  }
};

module.exports = { addToCart, getCart, deleteCart };
