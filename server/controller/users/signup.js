const users = require("../../models/users");

module.exports = {
  post: async (req, res) => {
    const { user_address } = req.params;
    const { user_nickname, character_index } = req.body;

    // 1. 지갑연결 확인
    if (!user_address) {
      return res.status(400).send("wallet not found");
    }

    // 2. 입력 정보 확인
    if (!(user_nickname && character_index)) {
      return res.status(400).send("Bad Request");
    }

    try {
      // 3. 닉네임 중복 확인
      users.findOne({ user_nickname: user_nickname }).then((data) => {
        if (data) {
          res.status(400).send("nickname already exists");
        } else {
          // 4. DB save
          let usersData = new users({
            user_address: user_address,
            user_nickname: user_nickname,
            character_index: character_index,
          });

          usersData.save((err) => {
            if (err) {
              res.status(404).send({ message: "fail to signup.." });
            } else {
              res.status(201).send({ message: "signup succeed!" });
            }
          });
        }
      });
    } catch (err) {
      res.status(500).send("server error");
    }
  },
};
