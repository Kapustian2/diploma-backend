module.exports = function (user) {
  const { password, _id: id, updatedAt, __v, ...rest } = user;

  return { id, ...rest };
};
