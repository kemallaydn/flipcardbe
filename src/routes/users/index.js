import { Types } from "mongoose";
import { ROLES } from "../../constants/Roles";
import Users from "../../models/Users";
import router from "../../router";
import UserService from "../../services/user";
import { hashAndSaltPassword } from "../../utilities/crypto";

const updateMe = async (req, res) => {
  await UserService.update(req.user._id, req.body);
  let user = await UserService.findById(req.user._id);

  res.json(user);
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  const { password } = req.body;

  Object.entries(req.body).forEach(([key, value]) =>
    !value ? delete req.body[key] : null
  );

  if (password) {
    delete req.body.password;
  }
  await UserService.update(id, req.body);
  let user = await UserService.findById(id);
  if (password !== undefined) {
    let hs = hashAndSaltPassword(password);
    user.passwordHash = hs.hash;
    user.passwordSalt = hs.salt;
    await user.save();
  }

  res.json(user);
};

const deleteUser = async (req, res) => {
  // FIXME: admin and owner guard must be added
  let user = await UserService.findById(req.params.id);
  if (!user) {
    return res.status(404).send();
  }

  user.deletedAt = new Date();
  await user.save();
  return res.status(200).json([{ messages: "İşlem başarılı" }]);
};

const getUsers = async (req, res) => {
  if (!req.user || req.user.role !== ROLES.Admin) {
    return res.status(401);
  }

  return res.json(
    await Users.find({
      deletedAt: null,
    })
  );
};

const getUser = async (req, res) => {
  if (!req.user || req.user.role !== ROLES.Admin) {
    return res.status(401);
  }

  let data = await await Users.aggregate([
    {
      $match: { _id: new Types.ObjectId(req.params.id) }, // Kullanıcı adına göre eşleştirme yapılabilir
    },
    {
      $lookup: {
        from: "words", // Words koleksiyonu adı
        localField: "knowns.wordId", // knowns içindeki wordId alanı
        foreignField: "_id", // Words koleksiyonundaki _id alanı
        as: "knownWords", // Eşleşen verilerin atanacağı alan
      },
    },
    {
      $lookup: {
        from: "words", // Words koleksiyonu adı
        localField: "unknowns.wordId", // unknowns içindeki wordId alanı
        foreignField: "_id", // Words koleksiyonundaki _id alanı
        as: "unknownWords", // Eşleşen verilerin atanacağı alan
      },
    },

    {
      $project: {
        _id: 1,
        name: 1,
        username: 1,
        favorities: 1,
        knowns: "$knownWords",
        unknowns: "$unknownWords",
      },
    },
  ]);
  return res.json(data[0]);
};

export default [
  {
    prefix: "/users",
    inject: (routes) => {
      routes.get("", getUsers);
      routes.post("", (req, res) => res.send("users girdi"));
      routes.put("", updateMe);
      routes.get("/:id", getUser);
      routes.put("/:id", updateUser);
      routes.delete("/:id", deleteUser);
    },
  },
];
