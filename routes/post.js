"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = (0, express_1.Router)();
// controllers
var _a = require("../controllers/post"), createPost = _a.createPost, readPost = _a.readPost, updatePost = _a.updatePost, removePost = _a.removePost;
router.post("/createPost", createPost);
router.get("/readPost", readPost);
router.put("/updatePost", updatePost);
router.delete("/removePost", removePost);
