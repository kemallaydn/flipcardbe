import { LogLevel } from "../constants";
import fs from "fs";

const toLogString = (level, msg) => {
  if (Array.isArray(msg)) {
    msg = msg.map((msg) => JSON.stringify(msg)).join(" ");
  }
  if (typeof msg === "object") {
    msg = JSON.stringify(msg);
  }
  return `[${new Date().toLocaleString()}] [${level}] ${msg}`;
};
export default class Logger {
  static error(...msg) {
    this.#log(LogLevel.Error, toLogString(LogLevel.Error, msg));
  }
  static log(...msg) {
    this.#log(LogLevel.Log, msg);
  }
  static #log(level, msg) {
    Promise.all([
      this.#writeToFile(level, toLogString(level, msg)),
      this.#writeToStdout(level, toLogString(level, msg)),
    ]);
  }
  static async #writeToFile(level, msg) {
    let date = new Date();
    try {
      fs.appendFile(
        `${__dirname}/../../data/logs/${level}-${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()}.txt`,
        "\n" + msg,
        (err) => {
          if (err) {
            this.#writeToStdout(LogLevel.Error, err.toString());
          }
        }
      );
    } catch (error) {
      this.#writeToStdout(LogLevel.Error, error.toString());
    }
  }

  static async #writeToStdout(level, msg) {
    let fn = null;
    switch (level) {
      case LogLevel.Error:
        fn = console.log;
        break;
      case LogLevel.debug:
        fn = console.debug;
        break;
      default:
        fn = console.log;
    }
    fn(msg);
  }
}
