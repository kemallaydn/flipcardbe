import mongoose from "mongoose";
import UserModel from "../../models/Users";
import { hashAndSaltPassword } from "../../utilities/crypto";

const create = async ({ username, name, password, role }) => {
  if (!name || name === "") {
    throw new Error("Name can not be empty!");
  }

  let hash = null,
    salt = null;
  if (password !== null) {
    let hs = hashAndSaltPassword(password);
    hash = hs.hash;
    salt = hs.salt;
  }

  let user = await UserModel.findOne({ username });

  if (user) {
    throw new Error(`${username} username already using!`);
  }

  return await UserModel.create({
    username,
    role,
    name,
    passwordHash: hash,
    passwordSalt: salt,
  });
};

const findById = async (id) => {
  id = typeof id === "string" ? new mongoose.Types.ObjectId(id) : id;
  let u = await UserModel.findById(id);
  if (!u) {
    return null;
  }
  return u.deletedAt ? null : u;
};

let findOne = async (where) => {
  return await UserModel.findOne({ ...where, deletedAt: null });
};

const update = (id, { name, username, role }) => {
  let user = UserModel.updateOne(
    { _id: id, deletedAt: null },
    { name, username, role }
  );
  return user;
};

export default {
  findOne,
  findById,
  create,
  update,
};
