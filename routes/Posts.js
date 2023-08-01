const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

// GET ALL POSTS
router.get("/", validateToken, async (req, res) => {
  const listOfPosts = await Posts.findAll({ include: [Likes] });
  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
  res.json({ listOfPosts, likedPosts });
});

// GET POST BY ID
router.get("/byId/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Posts.findByPk(id);
    res.json(post);
  } catch (error) {
    console.log(`${error}`.red);
    res.json({ error: "User Doesn't Exist" });
  }
});

// GET ALL POSTS BY USER_ID
router.get("/byuserId/:id", async (req, res) => {
  const id = req.params.id;
  const listOfPosts = await Posts.findAll({
    where: { UserId: id },
    include: [Likes],
  });
  res.json(listOfPosts);
});

// CREATE POST
router.post("/", validateToken, async (req, res) => {
  // get the data from request object
  const post = req.body;
  // add username abd UserId to the post object from the validateToken object
  post.username = req.user.username;
  post.UserId = req.user.id;
  await Posts.create(post);
  res.json(post);
});

// UPDATE POST
router.put("/", validateToken, async (req, res) => {
  const { id, newTitle, newPostText } = req.body;
  const postUpdate = await Posts.update(
    { title: newTitle, postText: newPostText },
    { where: { id: id } }
  );
  res.json(postUpdate);
});

// DELETE A POST
router.delete("/:postId", validateToken, async (req, res) => {
  try {
    const postId = req.params.postId;
    await Posts.destroy({
      where: {
        id: postId,
      },
    });
    res.json("DELETED SUCCESSFULLY");
  } catch (error) {
    console.log(`${error}`.red);
    res.json({ error: "User Doesn't Exist" });
  }
});

module.exports = router;
