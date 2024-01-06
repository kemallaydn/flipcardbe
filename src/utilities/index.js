import { Types } from "mongoose";

export const isMongoObjectId = (id) => {
  try {
    let i = new Types.ObjectId(id);
    if (!i || id === undefined || id === "" || id === null) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};
