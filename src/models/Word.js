import mongoose, { ObjectId } from "mongoose";

export const WordSchema = new mongoose.Schema({
  en: {
    type: String,
    require: true,
  },
  tr: {
    type: String,
    require: true,
  },
});

export default mongoose.model("Word", WordSchema);
