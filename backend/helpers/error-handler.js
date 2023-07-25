const errorHandler = (err, req, res, next) => {
  //JWT auth error handler
  if (err.name === "UnauthorizedError") {
    return res.status(500).json({ message: "User not authorized" });
  }

  //validation error handler
  if (err.name === "ValidationError") {
    return res.status(401).json({ message: err });
  }

  //default 500 server error handler
  return res.status(500).json({ err });
};

module.exports = errorHandler;
