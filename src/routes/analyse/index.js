const analysis = async (req, res) => {


  return res.json({
    userCount: 10,
    falseCount: 54,
    trueCount: 62,
  });
};

export default [
  {
    prefix: "/analyse",
    inject(router) {
      router.get("", analysis);
    },
  },
];