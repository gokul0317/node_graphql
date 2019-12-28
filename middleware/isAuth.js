const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
      console.log(1)
    req.isAuth = false;
    return next();
  }

  const token = authHeader.split(" ")[1];
  console.log(token)
  if (!token || token.trim() == "") {
    req.isAuth = false;
    return next();
  }
  let decodeToken;
  try {
    decodeToken = jwt.verify(token, "someSuperSecretKey");
  } catch (e) {
    req.isAuth = false;
    return next();
  }
  if (!decodeToken) {
    req.isAuth = false;
    return next();
  }

  req.isAuth = true;
  req.userId = decodeToken.userId;
  return next();
};
