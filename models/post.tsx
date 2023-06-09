
import { Schema, model, } from "mongoose";
import User from "./user";

const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            trim:true,
            required: true,
        },
        urlPreview: {
            type: Object,
            required: true,
        },
        postedBy:{
            type: Schema.Types.ObjectId,
            ref: User
        },
        view:{
            type: Number,
            default: 0,
        },
        likes: [{type: Schema.Types.ObjectId, ref:User}]
    },
    { timestamps: true }
);

export default model('Post', postSchema);
