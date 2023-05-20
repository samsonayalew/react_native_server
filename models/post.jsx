"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_2 = require("mongoose");
const user_1 = __importDefault(require("./user"));
const postSchema = new mongoose_2.Schema({
    title: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        trim: true,
        required: true,
    },
    urlPreview: {
        type: Object,
        required: true,
    },
    postedBy: {
        type: mongoose_2.Schema.Types.ObjectId,
        ref: user_1.default
    },
    view: {
        type: Number,
        default: 0,
    },
    likes: [{ type: mongoose_2.Schema.Types.ObjectId, ref: user_1.default }]
}, { timestamps: true });
exports.default = (0, mongoose_2.model)('Post', postSchema);
