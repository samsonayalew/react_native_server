"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = (0, express_1.Router)();
// controllers
var _a = require("../controllers/auth"), signup = _a.signup, signin = _a.signin, forgotPassword = _a.forgotPassword, resetPassword = _a.resetPassword, uploadImage = _a.uploadImage, requireSignin = _a.requireSignin, updatePassword = _a.updatePassword;
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
exports.default = router;
