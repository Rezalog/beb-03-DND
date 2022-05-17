const users = require("../../models/users");

module.exports = {
  get: async (req, res) => {
    const { user_address } = req.params;

    // 1. 지갑연결 확인
    if (!user_address) {
      return res.status(400).send("wallet not found");
    }
    console.log(user_address);
    // 2. 지갑주소가 db에 있는지 검증
    await users.findOne({ user_address: user_address }, (err, userData) => {
      // 2-1. 지갑주소가 없으면 fail(signup으로)
      if (userData === null) {
        // findone으로 찾았을때 userData가 없으면, err가 아닌 null로 넘어옴
        return res
          .status(400)
          .send("signin fail : 유저의 지갑주소 정보가 없음");
      }

      // 2-2. 지갑주소가 있으면 user_nickname 이 있는지 검증
      if (!userData.user_nickname) {
        // 2-3. nickname이 없으면 fail(-> signup)
        res.status(400).send("signin fail : 닉네임, 캐릭터 정보가 없음");
      } else {
        // 3. nickname이 있으면 회원정보를 불러오고 jwt token generate
        userData
          .generateToken()
          .then((userData) => {
            // 4. jwt 를 cookie에 parsing
            res
              .cookie("x_auth", userData.token)
              .status(200)
              .json({ loginSuccess: true, user_Id: userData._id });
          })

          .catch((err) => {
            res.status(400).send(err);
          });
      }
    });
  },
};
