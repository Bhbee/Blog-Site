const router = require("express").Router();
const User = require("../models/User");
const Blog= require("../models/Blogs");

//CREATE BLOG
router.post("/", async (req, res) => {
  const newBlog = new Blog(req.body);
  try {
    const savedBlog = await newBlog.save();
    res.status(200).json(savedBlog);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE BLOG
router.put("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog.username === req.body.username) {
      try {
        const updatedBlog = await Blog.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedBlog);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your blog!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE BLOG
router.delete("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog.username === req.body.username) {
      try {
        await blog.delete();
        res.status(200).json("Blog has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can delete only your blog!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET BLOG
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL STATE BLOG
router.get("/", async (req, res) => {
  const state = req.query.state;
  try {
    let blogs;
    if (state) {
      posts = await Post.find({
        categories: {
          $in: [state],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;