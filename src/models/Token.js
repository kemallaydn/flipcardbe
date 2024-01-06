import mongoose, { ObjectId } from "mongoose";
import { TOKEN_TYPES, TOKEN_STATUSES } from "../constants/Roles";

export const TokenSchema = new mongoose.Schema({
  value: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    default: TOKEN_TYPES.Auth,
  },
  status: {
    type: String,
    default: TOKEN_STATUSES.Pending,
  },
  userId: {
    type: ObjectId,
    require: true,
    ref: "User",
  },
  expireAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

export default mongoose.model("Token", TokenSchema);
