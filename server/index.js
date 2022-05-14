require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const usersRouter = require("./routes/users");
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
  })
);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/users", usersRouter);

app.get("/", (req, res) => {});
app.listen(PORT, () => {
  console.log(`Listening...on ${PORT}`);
});
