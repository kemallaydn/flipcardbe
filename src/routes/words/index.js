import { ROLES } from "../../constants/Roles";
import Word from "../../models/Word";
import { isMongoObjectId } from "../../utilities";
import { io } from "../../server";
const create = async (req, res) => {
  if (!Object.keys(req.body).every((key) => key === "tr" || key === "en")) {
    return res.status(400).json({
      message: 'body "tr" ve "en" değerlerini içermelidir!',
    });
  }

  let { tr, en } = req.body;
  let word = await Word.create({
    tr,
    en,
  });

  io.emit("notfication", `Yeni bir kelime ekledi: ${word.en}`);
  return res.status(201).json(word);
};

const get = async (req, res) => {
  if (!isMongoObjectId(req.params.id)) {
    return res.status(400).json({
      message: "Hatalı id!",
    });
  }

  res.json(await Word.findById(id));
};
const gets = async (req, res) => {
  res.json(await Word.find({}));
};
const update = async (req, res) => {
  if (req.user.role !== ROLES.Admin) {
    return res.status(401).json({ message: "yetkiniz bulunmamakta!" });
  }

  let r = await Word.updateOne(
    { _id: req.params.id },
    { en: req.body.en, tr: req.body.tr }
  );

  return res.json(r);
};
const deleteWord = async (req, res) => {
  if (req.user.role !== ROLES.Admin) {
    return res.status(401).json({ message: "yetkiniz bulunmamakta!" });
  }

  let r = await Word.deleteOne({ _id: req.params.id });

  res.json(r);
};
export default [
  {
    prefix: "/words",
    inject: (routes) => {
      routes.get("", gets);
      routes.get("/:id", get);
      routes.post("", create);
      routes.put("/:id", update);
      routes.delete("/:id", deleteWord);
    },
  },
];
