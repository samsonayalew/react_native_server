"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePost = exports.updatePost = exports.readPost = exports.createPost = void 0;
const post_1 = __importDefault(require("../models/post"));
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, link, urlPreview } = req.body;
        // find user based on email and resetCode
        const post = yield post_1.default.create({ title, link, urlPreview });
        // if user not found
        console.log(req.body);
        if (post.id) {
            return res.json(post);
        }
        else if (!post || !link || !urlPreview) {
            return res.json({ error: "All the fields are required" });
        }
        else if (post.errors) {
            return res.json({
                error: post.errors,
            });
        }
        return res.json({ ok: true });
    }
    catch (err) {
        console.log(err);
    }
});
exports.createPost = createPost;
const readPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //
});
exports.readPost = readPost;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //
});
exports.updatePost = updatePost;
const removePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //
});
exports.removePost = removePost;
