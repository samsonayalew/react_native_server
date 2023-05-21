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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.uploadImage = exports.requireSignin = exports.resetPassword = exports.forgotPassword = exports.signin = exports.signup = void 0;
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nanoid_1 = require("nanoid");
const express_jwt_1 = require("express-jwt");
const { hashPassword, comparePassword } = require("../helpers/auth");
const cloudinary = require('cloudinary').v2;
//configure cloudinary image service
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});
// sendgrid email service
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("HIT SIGNUP");
    try {
        // validation
        const { name, email, password } = req.body;
        if (!name) {
            return res.json({
                error: "Name is required",
            });
        }
        if (!email) {
            return res.json({
                error: "Email is required",
            });
        }
        if (!password || password.length < 6) {
            return res.json({
                error: "Password is required and should be 6 characters long",
            });
        }
        const exist = yield user_1.default.findOne({ email });
        if (exist) {
            return res.json({
                error: "Email is taken",
            });
        }
        // hash password
        const hashedPassword = yield hashPassword(password);
        try {
            const user = yield new user_1.default({
                name,
                email,
                password: hashedPassword,
            }).save();
            // create signed token
            const token = jsonwebtoken_1.default.sign({ _id: user._id }, "some_secret_letters_numbers", {
                expiresIn: "7d",
            });
            //   console.log(user);
            const { password } = user, rest = __rest(user, ["password"]);
            return res.json({
                token,
                user: rest,
            });
        }
        catch (err) {
            console.log(err);
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body);
    try {
        const { email, password } = req.body;
        // check if our db has user with that email
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return res.json({
                error: "No user found",
            });
        }
        // check password
        const match = yield comparePassword(password, user.password);
        if (!match) {
            return res.json({
                error: "Wrong password",
            });
        }
        // create signed token
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, "some_secret_letters_numbers", {
            expiresIn: "7d",
        });
        res.json({
            token,
            user,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }
});
exports.signin = signin;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    // find user by email
    const user = yield user_1.default.findOne({ email });
    console.log("USER ===> ", user);
    if (!user) {
        return res.json({ error: "User not found" });
    }
    // generate code
    const resetCode = (0, nanoid_1.nanoid)(5).toUpperCase();
    // save to db
    user.resetCode = resetCode;
    user.save();
    // prepare email
    const emailData = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Password reset code",
        html: `
      <h4>
      Enter this pin in the app reset the pasword
      </h4>
      <h1>
        PIN: <span style="color:red">${resetCode}</span>
      </h1>
      `
    };
    // send email
    try {
        const data = yield sgMail.send(emailData);
        console.log(data);
        res.json({ ok: true });
    }
    catch (err) {
        console.log(err);
        res.json({ ok: false });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, resetCode } = req.body;
        // find user based on email and resetCode
        const user = yield user_1.default.findOne({ email, resetCode });
        // if user not found
        if (!user) {
            return res.json({ error: "Email or reset code is invalid" });
        }
        // if password is short
        if (!password || password.length < 6) {
            return res.json({
                error: "Password is required and should be 6 characters long",
            });
        }
        // hash password
        const hashedPassword = yield hashPassword(password);
        user.password = hashedPassword;
        user.resetCode = "";
        user.save();
        return res.json({ ok: true });
    }
    catch (err) {
        console.log(err);
    }
});
exports.resetPassword = resetPassword;
exports.requireSignin = (0, express_jwt_1.expressjwt)({
    secret: "some_secret_letters_numbers",
    algorithms: ['HS256']
});
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log('upload image > user id', JSON.stringify(req.user._id));
        const result = yield cloudinary.uploader.upload(req.body.image, {
            public_id: (0, nanoid_1.nanoid)()
        });
        // console.log('cloudinary ->',result);
        const user = yield user_1.default.findByIdAndUpdate(req.user._id, {
            image: {
                public_id: result.public_id,
                url: result.secure_url,
            }
        }, { new: true });
        return res.json({
            name: user === null || user === void 0 ? void 0 : user.name,
            email: user === null || user === void 0 ? void 0 : user.email,
            role: user === null || user === void 0 ? void 0 : user.role,
            image: user === null || user === void 0 ? void 0 : user.image,
        });
    }
    catch (e) {
        console.warn('cloudinary ERROR->', e);
    }
});
exports.uploadImage = uploadImage;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        if (password && password.length < 6) {
            return res.json({
                error: 'Password is required and should minimum 6 characters long',
            });
        }
        else {
            //update db
            const hashedPassword = yield hashPassword(password);
            const user = yield user_1.default.findByIdAndUpdate(req.user._id, { password: hashedPassword }, { new: true });
            // delete user?.password;
            return res.json(user);
        }
    }
    catch (e) {
    }
});
exports.updatePassword = updatePassword;
