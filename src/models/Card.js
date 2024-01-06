import mongoose, { ObjectId } from "mongoose";
import { ROLES } from "../constants/Roles";

export const CardSchema = new mongoose.Schema({
  wordId: {
    type: ObjectId,
    require: true,
    ref: "Word",
  },
  isSuccess: Boolean,
  answer: String,
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

export default mongoose.model("Card", CardSchema);
