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
    let arr = [];
    try {
      let result = await pairs.find({}, { _id: false, pair_address: true });
      for (let i = 0; i < result.length; i++) {
        arr.push(result[i].pair_address);
      }
      res.status(200).send(arr);
    } catch (err) {
      res.status(400).send(err);
    }
  },
};
