import "dotenv/config";
import Logger from "../utilities/Logger";

export default (error, req, res, next) => {
  Logger.error(
    `${Date.now()} ${req.path} ${req.method} ${req.ip} ${
      error.message
    } ${JSON.stringify(error)}`
  );
  if (process.env.NODE_ENV === "development") {
    res.status(500).send(error);
  }
  next(error);
};

