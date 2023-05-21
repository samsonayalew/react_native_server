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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var User = require("../models/user");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var nanoid_1 = require("nanoid");
var express_jwt_1 = require("express-jwt");
var _a = require("../helpers/auth"), hashPassword = _a.hashPassword, comparePassword = _a.comparePassword;
var cloudinary = require('cloudinary').v2;
//configure cloudinary image service
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});
// sendgrid email service
require("dotenv").config();
var sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);
var signup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, email, password, exist, hashedPassword, user, token, password_1, rest, err_1, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log("HIT SIGNUP");
                _b.label = 1;
            case 1:
                _b.trys.push([1, 8, , 9]);
                _a = req.body, name_1 = _a.name, email = _a.email, password = _a.password;
                if (!name_1) {
                    return [2 /*return*/, res.json({
                            error: "Name is required",
                        })];
                }
                if (!email) {
                    return [2 /*return*/, res.json({
                            error: "Email is required",
                        })];
                }
                if (!password || password.length < 6) {
                    return [2 /*return*/, res.json({
                            error: "Password is required and should be 6 characters long",
                        })];
                }
                return [4 /*yield*/, User.findOne({ email: email })];
            case 2:
                exist = _b.sent();
                if (exist) {
                    return [2 /*return*/, res.json({
                            error: "Email is taken",
                        })];
                }
                return [4 /*yield*/, hashPassword(password)];
            case 3:
                hashedPassword = _b.sent();
                _b.label = 4;
            case 4:
                _b.trys.push([4, 6, , 7]);
                return [4 /*yield*/, new User({
                        name: name_1,
                        email: email,
                        password: hashedPassword,
                    }).save()];
            case 5:
                user = _b.sent();
                token = jsonwebtoken_1.default.sign({ _id: user._id }, "some_secret_letters_numbers", {
                    expiresIn: "7d",
                });
                password_1 = user.password, rest = __rest(user, ["password"]);
                return [2 /*return*/, res.json({
                        token: token,
                        user: rest,
                    })];
            case 6:
                err_1 = _b.sent();
                console.log(err_1);
                return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 9];
            case 8:
                err_2 = _b.sent();
                console.log(err_2);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.signup = signup;
var signin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, match, token, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, User.findOne({ email: email })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.json({
                            error: "No user found",
                        })];
                }
                return [4 /*yield*/, comparePassword(password, user.password)];
            case 2:
                match = _b.sent();
                if (!match) {
                    return [2 /*return*/, res.json({
                            error: "Wrong password",
                        })];
                }
                token = jsonwebtoken_1.default.sign({ _id: user._id }, "some_secret_letters_numbers", {
                    expiresIn: "7d",
                });
                res.json({
                    token: token,
                    user: user,
                });
                return [3 /*break*/, 4];
            case 3:
                err_3 = _b.sent();
                console.log(err_3);
                return [2 /*return*/, res.status(400).send("Error. Try again.")];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.signin = signin;
var forgotPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, resetCode, emailData, data, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                return [4 /*yield*/, User.findOne({ email: email })];
            case 1:
                user = _a.sent();
                console.log("USER ===> ", user);
                if (!user) {
                    return [2 /*return*/, res.json({ error: "User not found" })];
                }
                resetCode = (0, nanoid_1.nanoid)(5).toUpperCase();
                // save to db
                user.resetCode = resetCode;
                user.save();
                emailData = {
                    from: process.env.EMAIL_FROM,
                    to: user.email,
                    subject: "Password reset code",
                    html: "\n      <h4>\n      Enter this pin in the app reset the pasword\n      </h4>\n      <h1>\n        PIN: <span style=\"color:red\">" + resetCode + "</span>\n      </h1>\n      "
                };
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, sgMail.send(emailData)];
            case 3:
                data = _a.sent();
                console.log(data);
                res.json({ ok: true });
                return [3 /*break*/, 5];
            case 4:
                err_4 = _a.sent();
                console.log(err_4);
                res.json({ ok: false });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.forgotPassword = forgotPassword;
var resetPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, resetCode, user, hashedPassword, err_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, password = _a.password, resetCode = _a.resetCode;
                return [4 /*yield*/, User.findOne({ email: email, resetCode: resetCode })];
            case 1:
                user = _b.sent();
                // if user not found
                if (!user) {
                    return [2 /*return*/, res.json({ error: "Email or reset code is invalid" })];
                }
                // if password is short
                if (!password || password.length < 6) {
                    return [2 /*return*/, res.json({
                            error: "Password is required and should be 6 characters long",
                        })];
                }
                return [4 /*yield*/, hashPassword(password)];
            case 2:
                hashedPassword = _b.sent();
                user.password = hashedPassword;
                user.resetCode = "";
                user.save();
                return [2 /*return*/, res.json({ ok: true })];
            case 3:
                err_5 = _b.sent();
                console.log(err_5);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.resetPassword = resetPassword;
exports.requireSignin = (0, express_jwt_1.expressjwt)({
    secret: "some_secret_letters_numbers",
    algorithms: ['HS256']
});
var uploadImage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, user, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, cloudinary.uploader.upload(req.body.image, {
                        public_id: (0, nanoid_1.nanoid)()
                    })];
            case 1:
                result = _a.sent();
                return [4 /*yield*/, User.findByIdAndUpdate(req.user._id, {
                        image: {
                            public_id: result.public_id,
                            url: result.secure_url,
                        }
                    }, { new: true })];
            case 2:
                user = _a.sent();
                return [2 /*return*/, res.json({
                        name: user === null || user === void 0 ? void 0 : user.name,
                        email: user === null || user === void 0 ? void 0 : user.email,
                        role: user === null || user === void 0 ? void 0 : user.role,
                        image: user === null || user === void 0 ? void 0 : user.image,
                    })];
            case 3:
                e_1 = _a.sent();
                console.warn('cloudinary ERROR->', e_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.uploadImage = uploadImage;
var updatePassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var password, hashedPassword, user, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                password = req.body.password;
                if (!(password && password.length < 6)) return [3 /*break*/, 1];
                return [2 /*return*/, res.json({
                        error: 'Password is required and should minimum 6 characters long',
                    })];
            case 1: return [4 /*yield*/, hashPassword(password)];
            case 2:
                hashedPassword = _a.sent();
                return [4 /*yield*/, User.findByIdAndUpdate(req.user._id, { password: hashedPassword }, { new: true })];
            case 3:
                user = _a.sent();
                // delete user?.password;
                return [2 /*return*/, res.json(user)];
            case 4: return [3 /*break*/, 6];
            case 5:
                e_2 = _a.sent();
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.updatePassword = updatePassword;
