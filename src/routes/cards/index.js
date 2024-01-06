import { ROLES } from "../../constants/Roles";
import Card from "../../models/Card";
import User from "../../models/Users";
import Word from "../../models/Word";
import { isMongoObjectId } from "../../utilities";

const create = async (req, res) => {
  // if (req.user.role !== ROLES.Admin) {
  //   return res.status(400).json({
  //     message: "unauthorized!",
  //   });
  // }

  let { word, answer } = req.body;

  let w = await Word.findById(word);

  if (!w) {
    return res.status(400).json({
      message: "Hatalı kelime id'si: " + word,
    });
  }

  let user = await User.findById(req.user._id);

  if (
    user.knowns.includes((k) => k.wordId.toString() === word) ||
    user.unknowns.includes((k) => k.wordId.toString() === word)
  ) {
    return res.send();
  }

  answer = answer.trim();

  let card = new Card();
  card.wordId = w._id;
  card.answer = answer;
  card.isSuccess = w.tr === answer;

  user[card.isSuccess ? "knowns" : "unknowns"].push(card);
  user.questionCount =
    (await Word.count()) - 1 == user.questionCount ? 0 : user.questionCount + 1;
  await user.save();
  return res.status(200).json(card);
};

const getMyCards = async (req, res) => {
  let data = await User.aggregate([
    {
      $match: { _id: req.user._id }, // Kullanıcı adına göre eşleştirme yapılabilir
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
        username: 1,
        knowns: "$knownWords",
        unknowns: "$unknownWords",
      },
    },
  ]);

  res.json({
    knowns: data[0].knowns, //.map((k) => k.word),
    unknowns: data[0].unknowns,
    favorities: req.user.favorities,
  });
};

const addFavority = async (req, res) => {
  if (!isMongoObjectId(req.params.id)) {
    return res.status(400).json({
      message: "Hatalı id!",
    });
  }

  let user = await User.findById(req.user._id);

  if (user.favorities.includes((f) => f._id.toString() == req.params.id)) {
    return res.json(user.favorities);
  }

  let word = await Word.findById(req.params.id);

  user.favorities.push(word);
  await user.save();

  return res.json(user.favorities);
};

export default [
  {
    prefix: "/cards",
    inject(router) {
      router.get("", getMyCards);
      router.post("", create);
      router.post("/favorities/:id", addFavority);
    },
  },
];
