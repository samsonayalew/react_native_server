"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_2 = __importDefault(require("mongoose"));
const { Schema } = mongoose_2.default;
const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 64,
    },
    role: {
        type: String,
        default: "Subscriber",
    },
    image: {
        public_id: "",
        url: "",
    },
    resetCode: "",
}, { timestamps: true });
exports.default = mongoose_2.default.model("User", userSchema);
