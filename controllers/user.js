const bcrypt = require("bcrypt");
const User = require("../models/User");
const { generate } = require("../helpers/token");
const ROLES = require("../constants/roles");

// register

async function register(login, password) {
  if (!password) {
    throw new Error("Password is empty");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({ login, password: passwordHash });
  const token = generate({ id: user.id });

  return { user, token };
}

// login

async function login(login, password) {
  const user = await User.findOne({ login });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error("Wrong password");
  }

  const token = generate({ id: user.id });

  return { token, user };
}

function getUsers() {
  return User.find();
}

async function updateUser(id, userData) {
  return await User.findByIdAndUpdate(id, userData, {
    returnDocument: "after",
    new: true,
  });
}

function getRoles() {
  return [
    { id: ROLES.ADMIN, name: "Admin" },
    { id: ROLES.CUSTOMER, name: "Customer" },
    { id: ROLES.GUEST, name: "Guest" },
  ];
}

module.exports = {
  register,
  login,
  getUsers,
  getRoles,
  updateUser,
};
