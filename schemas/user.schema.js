const UserSchema = {
  type: "object",
  properties: {
    login: {
      type: "string",
    },
    password: {
      type: "string",
    },
    role: {
      type: "number",
    },
  },
};

const createUserSchema = {
  ...UserSchema,
  required: ["login", "password"],
};

const updateUserSchema = {
  ...UserSchema,
  minProperties: 1,
  additionalProperties: false,
};

module.exports = {
  createUserSchema,
  updateUserSchema,
};
