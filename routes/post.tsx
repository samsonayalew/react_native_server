
import {Router} from "express";
const router = Router();

// controllers
const {
 createPost, readPost, updatePost, removePost
} = require("../controllers/post");


router.post("/createPost", createPost);
router.get("/readPost", readPost);
router.put("/updatePost", updatePost);
router.delete("/removePost", removePost);
