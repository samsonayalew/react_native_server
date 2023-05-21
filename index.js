"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// import cors from "cors";
var mongoose_1 = require("mongoose");
var express_1 = __importStar(require("express"));
var _a = require("./controllers/post"), createPost = _a.createPost, readPost = _a.readPost, updatePost = _a.updatePost, removePost = _a.removePost;
// controllers
var _b = require("./controllers/auth"), signup = _b.signup, signin = _b.signin, forgotPassword = _b.forgotPassword, resetPassword = _b.resetPassword, uploadImage = _b.uploadImage, requireSignin = _b.requireSignin, updatePassword = _b.updatePassword;
var DATABASE = require("./config").DATABASE;
var morgan = require("morgan");
var app = (0, express_1.default)();
var router = (0, express_1.Router)();
// const application = express();
// db connection+
(0, mongoose_1.connect)(DATABASE)
    .then(function () { return console.log("DB connected"); })
    .catch(function (err) { return console.log("DB CONNECTION ERROR: ", err); });
// middlewares
app.use((0, express_1.json)({ limit: "4mb" }));
app.use((0, express_1.urlencoded)({ extended: true }));
// application.use(cors());
app.use(morgan("dev"));
// route middlewares
router.get("/", function (req, res) {
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
app.listen(8000, function () { return console.log("Server running on port 8000"); });
