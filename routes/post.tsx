
import * as express from "express";
const router = express.Router();

// controllers
import {
 createPost, readPost, updatePost, removePost
} from  "../controllers/post";


router.post("/createPost", createPost);
router.get("/readPost", readPost);
router.put("/updatePost", updatePost);
router.delete("/removePost", removePost);

export default router;
