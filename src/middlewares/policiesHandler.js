const policiesHandler = (policies) => (req, res, next) => {
  if (policies[0] === "PUBLIC") return next();

  const token = req.cookies["coderCookie"];

  if (!token) return res.send({ status: "error", error: "No authorization" });

  const user = jwt.verify(token, JWT_PRIVATE_KEY);

  if (!policies.includes(user.user.role.toUpperCase()))
    return res.status(403).send({ status: "error", error: "Not permissions" });
  req.user = user.user;

  next();
};

module.exports = { policiesHandler };
