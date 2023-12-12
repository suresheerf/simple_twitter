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
exports.signup = exports.signin = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const bcrypt_1 = require("bcrypt");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const config_1 = require("../config/config");
const user_model_1 = __importDefault(require("../models/user.model"));
const signToken = (id) => (0, jsonwebtoken_1.sign)({ id }, config_1.JWT_SECRET, {
    expiresIn: config_1.JWT_EXPIRES_IN,
});
const createSendToken = (user, statusCode, req, res) => {
    console.log('sending token');
    const token = signToken(user._id);
    res.status(statusCode).json({
        token,
    });
};
/**
 * @swagger
 * tags:
 *   name: user
 *   description: api for user management
 * /api/signin:
 *   post:
 *     summery: signin api
 *     tags: [user]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user1@gmail.com
 *               password:
 *                 type: string
 *                 example: user@123
 *     responses:
 *       200:
 *         description: successful signin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *
 */
exports.signin = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('body:', req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new appError_1.default('please provide email and password', 400));
    }
    const user = yield user_model_1.default.findOne({ email: req.body.email });
    if (!user) {
        return next(new appError_1.default('Could not find the user with given email', 404));
    }
    const pass = yield (0, bcrypt_1.hash)(password, 12);
    console.log('pass:', pass);
    const isCorrect = yield (0, bcrypt_1.compare)(password, user.password);
    console.log('isCorrect:', isCorrect);
    if (isCorrect) {
        createSendToken(user, 200, req, res);
    }
    else {
        next(new appError_1.default('Please enter correct password', 400));
    }
}));
/**
 * @swagger
 * /api/signup:
 *   post:
 *     summery: signup api
 *     tags: [user]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user1@gmail.com
 *               password:
 *                 type: string
 *                 example: user@123
 *               name:
 *                 type: string
 *                 example: user1
 *     responses:
 *       200:
 *         description: successful signup
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *
 */
exports.signup = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('body:', req.body);
    const { email, password, name } = req.body;
    if (!email || !password) {
        return next(new appError_1.default('please provide email and password', 400));
    }
    const user = yield user_model_1.default.findOne({ email: req.body.email });
    if (user) {
        return next(new appError_1.default('Email already taken please use another', 400));
    }
    const newUser = yield user_model_1.default.create({ email, password, name });
    createSendToken(newUser, 200, req, res);
}));
