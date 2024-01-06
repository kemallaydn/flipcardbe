import Logger from "../utilities/Logger.js";

export default (req, res, next) => {
  Logger.log(
    `${Date.now()} ${req.path} ${req.method} ${req.ip} ${
      req.headers["x-access-token"] ?? "TOKENLESS"
    }`
  );
  next();
};
