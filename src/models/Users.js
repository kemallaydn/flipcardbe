import mongoose, { ObjectId } from "mongoose";
import { ROLES } from "../constants/Roles";
import { CardSchema as Card } from "./Card";
import { WordSchema as Word } from "./Word";

export const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    questionCount:{
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      default: ROLES.User,
    },
    passwordHash: {
      type: String,
      require: true,
      default: null,
    },
    passwordSalt: {
      type: String,
      require: true,
      default: null,
    },
    favorities: {
      type: [Word],
      default: [],
    },
    knowns: {
      type: [Card],
      default: [],
    },
    unknowns: {
      type: [Card],
      default: [],
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
  },
  {
    methods: {
      toJSON() {
        let u = this.toObject();
        delete u.passwordHash;
        delete u.passwordSalt;
        return u;
      },
    },
  }
);

export default mongoose.model("User", UserSchema);
