const users = require("../../models/users");

module.exports = {
  get: async (req, res) => {
    console.log(req.cookies);
    let token = req.cookies.x_auth;

    // cookie-parser로 cookie의 token 을 받아 회원정보를 조회한다.

    await users
      .findByToken(token)
      .then((user) => {
        if (!user) return res.json({ isAuth: false, error: true });

        req.token = token;
        req.user = user;
        res.json({ profile: user });
      })

      .catch((err) => {
        res.status(400).send(err);
      });
  },
};
