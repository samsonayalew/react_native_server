"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var User = require("./user");
var postSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId
    },
    view: {
        type: Number,
        default: 0,
    },
    likes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: User }]
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Post', postSchema);
