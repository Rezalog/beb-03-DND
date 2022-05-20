const tokens = require("../../models/tokens");

module.exports = {
  post: async (req, res) => {
    const { token_address, token_name, token_symbol } = req.body;
    try {
      let tokenData = new tokens({
        token_address: token_address,
        token_name: token_name,
        token_symbol: token_symbol,
      });
      tokenData.save((err) => {
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
    await tokens
      .find()
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => res.status(400).send(err));
  },
};
