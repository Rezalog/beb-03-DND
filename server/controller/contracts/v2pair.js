const v2pairs = require("../../models/v2pairs");

module.exports = {
  post: async (req, res) => {
    const { v2pair_address, v2pair_name, v2tokenA_address, v2tokenB_address } =
      req.body;
    try {
      let v2pairData = new v2pairs({
        v2pair_address,
        v2pair_name,
        v2tokenA_address,
        v2tokenB_address,
      });
      v2pairData.save((err) => {
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
      let result = await v2pairs.find(
        {},
        {
          _id: false,
          v2pair_address: true,
          v2pair_name: true,
          v2tokenA_address: true,
          v2tokenB_address: true,
        }
      );
      for (let i = 0; i < result.length; i++) {
        arr.push({
          v2pair_address: result[i].v2pair_address,
          v2pair_name: result[i].v2pair_name,
          v2tokenA_address: result[i].v2tokenA_address,
          v2tokenB_address: result[i].v2tokenB_address,
        });
      }
      res.status(200).send(arr);
    } catch (err) {
      res.status(400).send(err);
    }
  },
};
