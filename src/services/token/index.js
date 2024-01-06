import { TOKEN_TYPES, TOKEN_STATUSES } from "../../constants/Roles";
import TokenModel from "../../models/Token";
import * as CyrptoService from "../../utilities/crypto";

const AuthTokenExpireTime = 1000 * 60 * 60 * 24 * 3; // 3 Day

const createToken = async ({
  value,
  userId,
  type = TOKEN_TYPES.Auth,
  status = TOKEN_STATUSES.Pending,
  expireMilisecondAfter = 1000 * 60 * 60 * 24 * 3,
}) => {
  if (Object.keys(TOKEN_TYPES).includes(type) === -1) {
    throw new Error(`Invalid token type: ${type}`);
  }

  if (Object.keys(TOKEN_STATUSES).includes(status) === -1) {
    throw new Error(`Invalid token status: ${status}`);
  }

  return await TokenModel.create({
    value,
    type,
    userId,
    status,
    expireAt: Date.now() + expireMilisecondAfter,
  });
};

const createAuthToken = async (userId) => {
  return await createToken({
    value: CyrptoService.encrypt(CyrptoService.generateSalt()),
    type: TOKEN_TYPES.Auth,
    status: TOKEN_STATUSES.Active,
    expireMilisecondAfter: AuthTokenExpireTime,
    userId,
  });
};



const deactivateActiveAuthToken = async (userId) => {
  return await TokenModel.updateMany(
    { userId, type: TOKEN_TYPES.Auth, status: TOKEN_STATUSES.Active },
    {
      status: TOKEN_STATUSES.Canceled,
      updatedAt: new Date(),
    }
  );
};

const findByValue = async (value) => {
  if (!value) {
    return null;
  }
  return (
    await TokenModel.aggregate([
      {
        $match: {
          value,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
    ])
  )[0];
};

const getUserFromToken = async (value) => {
  return (await findByValue(value))?.user[0];
};

export default {
  getUserFromToken,
  findByValue,
  deactivateActiveAuthToken,
  createToken,
  createAuthToken,
};
