const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// Define Schemes
const usersSchema = new mongoose.Schema({
  
  user_address : { type: String, required: true },
  user_nickname : { type: String },  
  character_index: { type: String },
  user_uru_bal: { type: String, default: '0' },
  user_uru_lock_bal: { type: String, default: '0' },
  user_lp_bal: { type: String, default: '0'},
//   privateKey: { type: String, required: true }
},
{
  timestamps: true
});


// jwt 토큰 생성 후 
usersSchema.methods.generateToken = function () {
  const token = jwt.sign(this._id.toHexString(), "secretToken");
  this.token = token;
  return this.save()
    .then((user) => user)
    .catch((err) => err);
};

usersSchema.statics.findByToken = function (token) {
  let user = this;
  
  // secretToken을 통해 user의 id값을 받아오고 해당 아이디를 통해
  // DB에 접근해서 유저의 정보를 가져온다
  return jwt.verify(token, "secretToken", function (err, decoded) {
    return user
      .findOne({ _id: decoded })
      .then((user) => user)
      .catch((err) => err);
  });
};

// Create Model & Export
module.exports = mongoose.model('users', usersSchema);