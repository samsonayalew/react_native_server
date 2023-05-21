const Post = require("../models/post");

export const createPost = async (req, res) => {
  try {
    const { title, link, urlPreview } = req.body;
    // find user based on email and resetCode
    const post = await Post.create({ title, link, urlPreview });
    
    // if user not found
    console.log(req.body);
    if(post.id){
      return res.json(post);
    }else if (!post || !link || !urlPreview) {
      return res.json({ error: "All the fields are required" });
    }else if (post.errors) {
      return res.json({
        error: post.errors,
      });
    }
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const readPost = async (req, res) => {
  //
};

export const updatePost = async (req, res) => {
  //
};

export const removePost = async (req, res) => {
  //
};
