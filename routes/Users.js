const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  await bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
    });
    res.json("SUCCESS TO ADD POST");
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({ where: { username: username } });

  if (!user) {
    res.json({ error: "User Doesn't Exist" });
  } else {
    await bcrypt.compare(password, user.password).then((match) => {
      if (!match) {
        res.json({ error: "Wrong Username And Password Combination" });
      } else {
        const accessToken = sign(
          { username: user.username, id: user.id },
          "importantSecret"
        );
        res.json({ token: accessToken, username: user.username, id: user.id });
      }
    });
  }
});

router.get("/auth", validateToken, (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.log(`${error}`.red);
    res.json({ error: "User Doesn't Exist" });
  }
});

router.get("/basicinfo/:id", async (req, res) => {
  const id = req.params.id;
  const basicinfo = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });

  res.json(basicinfo);
});

// UPDATE PASSWORD
router.put("/changepassword", validateToken, async (req, res) => {
  try {
    console.log(req.body);
    const { oldPassword, newPassword } = req.body;
    const user = await Users.findOne({
      where: { username: req.user.username },
    });

    await bcrypt.compare(oldPassword, user.password).then(async (match) => {
      if (!match) {
        res.json({ error: "Wrong Password Entred !" });
      } else {
        await bcrypt.hash(newPassword, 10).then(async (hash) => {
          await Users.update(
            {
              password: hash,
            },
            { where: { username: req.user.username } }
          );
          res.json("SUCCESS");
        });
      }
    });
  } catch (error) {
    res.json({ error: error });
  }
});

module.exports = router;
