module.exports = function (user) {
  return {
    id: user.id,
    login: user.login,
    role: user.role,
  };
};
