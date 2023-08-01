const express = require("express");
const app = express();
const cors = require("cors");
require("colors");
require("dotenv").config();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

const db = require("./models");

// POSTS ROUTER
const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);
// COMMENTS ROUTER
const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);
// USERS ROUTER
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);
// LIKES ROUTER
const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);

// SEQUELIZE
db.sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        " OK ".green.inverse + ` SERVER IS RUNNING ON PORT : ` + `${PORT}`.green
      );
    });
  })
  .catch((err) => {
    console.log(" NOK ".red.inverse + `${err}`.red);
  });
