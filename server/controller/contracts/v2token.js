const v2tokens = require("../../models/v2tokens");

module.exports = {
  post: async (req, res) => {
    try {
      req.body.forEach((token) => {
        const { token_address, token_name, token_symbol } = token;
        const tokenData = new v2tokens({
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
    await v2tokens
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
