const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", async (req, res) => {
  const listOfComments = await Comments.findAll();
  res.json(listOfComments);
});

router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;
  const comments = await Comments.findAll({ where: { PostId: postId } });
  res.json(comments);
});

router.post("/", validateToken, async (req, res) => {
  const comment = req.body;
  const username = req.user.username; //the user is comme from validateToken, it is added inside the req object and accessible wherever this middleware is used
  comment.username = username;
  const addedComment = await Comments.create(comment);
  console.log(addedComment);
  res.json(addedComment);
});

router.delete("/:commentId", validateToken, async (req, res) => {
  const commentId = req.params.commentId;
  await Comments.destroy({
    where: {
      id: commentId,
    },
  });
  res.json("DELETED SUCCESSFULLY");
});

module.exports = router;
