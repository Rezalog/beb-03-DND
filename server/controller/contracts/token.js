const tokens = require("../../models/tokens");

module.exports = {
  post: async (req, res) => {
    try {
      // let tokenA = new tokens({
      //   token_address: req.body[0].token_address,
      //   token_name: req.body[0].token_name,
      //   token_symbol: req.body[0].token_symbol,
      // });
      // let tokenB = new tokens({
      //   token_address: req.body[1].token_address,
      //   token_name: req.body[1].token_name,
      //   token_symbol: req.body[1].token_symbol,
      // });
      // tokenA.save((err) => {
      //   if (err) {
      //     res.status(404).send({ message: "fail to saving.." });
      //   } else {
      //     tokenB.save((err) => {
      //       if (err) {
      //         res.status(404).send({ message: "fail to saving.." });
      //       } else {
      //         res.status(201).send({ message: "saving succeed!" });
      //       }
      //     });
      //   }
      // });
      req.body.forEach((token) => {
        const { token_address, token_name, token_symbol } = token;
        const tokenData = new tokens({
          token_address,
          token_name,
          token_symbol,
        });
        tokenData.save((err) => {
          if (err) {
            res.status(404).send({ message: "fail to saving.." });
          }
        });
      });
      res.status(201).send({ message: "saving succeed!" });
    } catch (err) {
      console.log(err);
      res.status(500).send("error occured");
    }
  },

  get: async (req, res) => {
    await tokens
      .find(
        {},
        {
          _id: false,
          token_address: true,
          token_name: true,
          token_symbol: true,
        }
      )
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => res.status(400).send(err));
  },
};
