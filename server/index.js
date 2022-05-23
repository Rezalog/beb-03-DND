require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // cookieParser 추가
const app = express();
const mongoose = require("mongoose");
const usersRouter = require("./routes/users");
const contractsRouter = require("./routes/contracts");
const { PORT, USER_NAME, USER_PASSWORD, CLOUD_NAME, DATABASE_NAME } =
  process.env;

const MONGO_URI = `mongodb+srv://${USER_NAME}:${USER_PASSWORD}@${CLOUD_NAME}.xhvhs.mongodb.net/${DATABASE_NAME}`;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected..."))
  .catch((error) => console.log(error));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // 클라이언트에 withCredential과 함께 추가
  })
);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); // cookieParser 추가
app.use("/users", usersRouter);
app.use("/contracts", contractsRouter);

app.get("/", (req, res) => {});
app.listen(PORT, () => {
  console.log(`Listening...on ${PORT}`);
});
