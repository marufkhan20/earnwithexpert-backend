const jwt = require("jsonwebtoken");

// check authentication
const checkAdminAuth = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        error: "Authentication Failure!!",
      });
    }

    token = token.replace("Bearer ", "");

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (decode?.role !== "admin") {
      return res.status(401).json({
        error: "You are not Admin!!",
      });
    }

    req.user = decode;
    next();
  } catch (err) {
    res.status(401).json({
      message: "JWT Expire!!",
    });
  }
};

module.exports = checkAdminAuth;
