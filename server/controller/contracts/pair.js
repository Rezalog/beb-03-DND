const pairs = require("../../models/pairs");

module.exports = {
  post: async (req, res) => {
    const { pair_address } = req.body;
    try {
      let pairData = new pairs({
        pair_address: pair_address,
      });
      pairData.save((err) => {
        if (err) {
          res.status(404).send({ message: "fail to saving.." });
        } else {
          res.status(201).send({ message: "saving succeed!" });
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("error occured");
    }
  },

  get: async (req, res) => {
    await pairs
      .find({}, { _id: false, pair_address: true })
      .then((data) => {
        let arr = [];

        res.status(200).json(data);
      })
      .catch((err) => res.status(400).send(err));
  },
};
