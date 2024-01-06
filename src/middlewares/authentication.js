import { TOKEN_STATUSES, ROLES } from "../constants/Roles";
import TokenService from "../services/token";
import { WHITELIST } from "../constants";

let isIgnoredPath = (path, method) => {
  return WHITELIST.some((p) => p.method === method && p.path.test(path));
};

export default async (req, res, next) => {
  if (isIgnoredPath(req.baseUrl + req.path, req.method)) {
    return next();
  }
  const value = req.headers["x-access-token"];
  if (!value) {
    return res.status(401).json([{ message: "Unauthorized!" }]);
  }

  let token = await TokenService.findByValue(value);

  if (
    !token ||
    token?.expireAt < Date.now() ||
    token?.status !== TOKEN_STATUSES.Active
  ) {
    return res.status(401).json([
      {
        message:
          "Oturumunuzun süresi dolmuş veya başka cihazdan giriş yapılmış olabilir. Yeniden giriş yapınız.",
      },
    ]);
  }

  if (token.user[0].role == ROLES.Admin) {
    req.user = token.user[0];
    return next();
  }


  req.user = token.user[0];
  next();
};
