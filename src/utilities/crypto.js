import crypto from "crypto";

import "dotenv/config";

const secretKey = process.env.SECRET_KEY || "3Thi:R~YJJc#%9a";
const defaultLength = 12;

export const generateSalt = (length = defaultLength) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
};

export const encrypt = (
  data,
  cryptType = "sha256",
  secret = secretKey,
  encoding = "hex"
) => {
  return crypto.createHmac(cryptType, secret).update(data).digest(encoding);
};

export const createHash = (password, salt) => {
  return crypto.createHmac("sha512", salt).update(password).digest("hex");
};

export const hashAndSaltPassword = (password) => {
  let salt = generateSalt();
  let hash = createHash(password, salt);
  return {
    salt,
    hash,
  };
};

export const checkPassword = (pass, hash, salt) => {
  return hash === createHash(pass, salt);
};
