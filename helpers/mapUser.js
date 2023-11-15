module.exports = function (user) {
  // const { password, _id: id, updatedAt, __v, ...rest } = user;

  // return { id, ...rest };
  return {
    id: user.id,
    login: user.login,
    role: user.role,
    createdAt: user.createdAt,
  };
};
