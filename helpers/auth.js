"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var hashPassword = function (password) {
    return new Promise(function (resolve, reject) {
        bcrypt_1.default.genSalt(12, function (err, salt) {
            if (err) {
                reject(err);
            }
            bcrypt_1.default.hash(password, salt, function (err, hash) {
                if (err) {
                    reject(err);
                }
                resolve(hash);
            });
        });
    });
};
exports.hashPassword = hashPassword;
var comparePassword = function (password, hashed) {
    return bcrypt_1.default.compare(password, hashed);
};
exports.comparePassword = comparePassword;
