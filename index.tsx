// import cors from "cors";
import {connect} from "mongoose";
import express, {json, urlencoded, Application, Router} from "express";

const {
  createPost, readPost, updatePost, removePost
 } = require("./controllers/post");
 
// controllers
const {
  signup,
  signin,
  forgotPassword,
  resetPassword,
  uploadImage,
  requireSignin,
  updatePassword,
} = require("./controllers/auth");

const { DATABASE } = require("./config");

const morgan = require("morgan");

const app: Application = express();
const router = Router();

// const application = express();

// db connection+
  connect(DATABASE)
  .then(() => console.log("DB connected"))
  .catch((err: any) => console.log("DB CONNECTION ERROR: ", err));

// middlewares
app.use(json({ limit: "4mb" }));
app.use(urlencoded({ extended: true }));
// application.use(cors());
app.use(morgan("dev"));

// route middlewares

router.get("/", (req, res) => {
  return res.json({
    data: "hello world from kaloraat auth API",
  });
});
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/upload-image", requireSignin, uploadImage);
router.post('/update-password', requireSignin, updatePassword);


router.post("/createPost", createPost);
router.get("/readPost", readPost);
router.put("/updatePost", updatePost);
router.delete("/removePost", removePost);

app.use('/api', router);

app.listen(8000, () => console.log("Server running on port 8000"));
