module.exports = function (roles) {
  return (req, res, next) => {
    if (!req.user) {
      res.status(403).send("Unauthorized");
    }
    if (!roles.includes(req.user.role)) {
      res.send({ error: "Access denied!" });

      return;
    }

    next();
  };
};
