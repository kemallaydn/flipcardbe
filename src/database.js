import Mongoose from "mongoose";
import Logger from "./utilities/Logger.js";

const connect = async () => {
  await Mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
  });

  await Mongoose.connection.on("connected", () => {
    Logger.log(
      `Mongoose default connection open to ${process.env.MONGO_CONNECTION_STRING}`
    );
  });

  await Mongoose.connection.on("error", (err) => {
    Logger.log(`Mongoose default connection error: ${err}`);
  });

  await Mongoose.connection.on("disconnected", () => {
    Logger.log("Mongoose default connection disconnected");
  });
};

export default connect;
