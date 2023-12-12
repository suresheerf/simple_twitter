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
exports.unfollowUser = exports.followUser = exports.getUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
/**
 * @swagger
 * tags:
 *   name: user
 *   description: api for user management
 * /api/user:
 *   get:
 *     summery: get user
 *     tags: [user]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 followers:
 *                   type: number
 *                 following:
 *                   type: number
 *
 */
exports.getUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = {
        name: req.user.name,
        followers: req.user.followers.length,
        following: req.user.following.length,
    };
    res.status(200).json(user);
}));
/**
 * @swagger
 * /api/follow/{userId}:
 *   post:
 *     summery: get user
 *     tags: [user]
 *     parameters:
 *       - in: params
 *         name: userId
 *         type: string
 *         example: 64dc65bc0b3f317aa89fc728
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Following user successfully
 *
 */
exports.followUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const other_user = yield user_model_1.default.findByIdAndUpdate(req.params.userId, {
        $addToSet: { followers: req.user._id },
    });
    const user = yield user_model_1.default.findByIdAndUpdate(req.user._id, {
        $addToSet: { following: req.params.userId },
    });
    if (!other_user || !user) {
        return next(new appError_1.default('Something went wrong', 409));
    }
    res.status(200).json({ status: 'success', message: 'Following user successfully' });
}));
/**
 * @swagger
 * /api/unfollow/{userId}:
 *   post:
 *     summery: get user
 *     tags: [user]
 *     parameters:
 *       - in: params
 *         name: userId
 *         type: string
 *         example: 64dc65bc0b3f317aa89fc728
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Following user successfully
 *
 */
exports.unfollowUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const other_user = yield user_model_1.default.findByIdAndUpdate(req.params.userId, {
        $pull: { followers: req.user._id },
    });
    const user = yield user_model_1.default.findByIdAndUpdate(req.user._id, {
        $pull: { following: req.params.userId },
    });
    if (!other_user || !user) {
        return next(new appError_1.default('Something went wrong', 409));
    }
    res.status(200).json({ status: 'success', message: 'unfollowing user successfully' });
}));
