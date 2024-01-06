import TokenService from "../../services/token";
import * as CryptoSevice from "../../utilities/crypto";
import UserService from "../../services/user";

import Joi from "joi";
import { ROLES, TOKEN_STATUSES, TOKEN_TYPES } from "../../constants/Roles";
import TokenModel from "../../models/Token";
import Logger from "../../utilities/Logger.js";

const login = async (req, res) => {
  try {
    const bodySchema = Joi.object({
      username: Joi.string().required().messages({
        "any.required": "Kullanıcı adı boş bırakılamaz!",
        "string.empty": "Kullanıcı adı boş bırakılamaz!",
      }),
      password: Joi.string().max(25).required().messages({
        "any.required": "Şifre boş bırakılamaz!",
        "string.empty": "Şifre boş bırakılamaz!",
      }),
    }).options({ abortEarly: false });
    // "string.max": "Şifre en fazla 25 karakterli olmalıdır",
    // "string.min": "Şifre en az 8 karakterli olmalıdır",

    const { error } = bodySchema.validate(req.body);
    if (error) {
      return res.status(400).json(error.details);
    }
    let user = await UserService.findOne({
      username: req.body.username,
    });

    if (!user || user.deletedAt) {
      return res.status(401).json([
        {
          message: "Yanlış kullanıcı adı veya şifre giriniz!",
        },
      ]);
    }

    if (
      !CryptoSevice.checkPassword(
        req.body.password,
        user.passwordHash,
        user.passwordSalt
      )
    ) {
      return res
        .status(401)
        .json([{ message: "Yanlış kullanıcı adı veya şifre girdiniz!" }]);
    }

    await TokenService.deactivateActiveAuthToken(user._id);
    let token = await TokenService.createAuthToken(user._id);

    return res.send({
      token,
      user: user.toObject(),
    });
  } catch (err) {
    Logger.log({ err });
    res.status(400).json({ err });
  }
};

const signup = async (req, res) => {
  // if (!req.user || req.user.role !== ROLES.Admin) {
  //   return res.status(404);
  // }

  let { username, role, password, name } = req.body;

  if(!role){
    role = ROLES.User;
  }
  let user = await UserService.create({ username, role, password, name });

  return res.status(201).json(user);
};

const me = async (req, res) => {
  let token = await TokenModel.findOne({
    status: TOKEN_STATUSES.Active,
    type: TOKEN_TYPES.Auth,
    userId: req.user._id,
  });

  return res.status(req.user ? 200 : 401).json({
    user: req.user,
    token,
  });
};

export default {
  prefix: "/authentication",
  inject: (routes) => {
    routes.post("/login", login);
    routes.post("/signup", signup);
    routes.get("/me", me);
  },
};
