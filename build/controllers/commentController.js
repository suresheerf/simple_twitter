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
const mongoose_1 = require("mongoose");
const comment_model_1 = __importDefault(require("../models/comment.model"));
const post_model_1 = __importDefault(require("../models/post.model"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
/**
 * @swagger
 * tags:
 *   name: comment
 *   description: api for comment management
 * /api/comment/{postId}:
 *   post:
 *     summery: signin api
 *     tags: [comment]
 *     parameters:
 *       - in: params
 *         name: postId
 *         type: string
 *         example: 64dc6a450b3f317aa89fc732
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 example: awesome post
 *     responses:
 *       201:
 *         description: successful comment creation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Comment-ID:
 *                   type: string
 *
 */
const createComment = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.comment) {
        return next(new appError_1.default('Comment can not be empty', 400));
    }
    const commentObj = {
        postId: new mongoose_1.Types.ObjectId(req.params.postId),
        userId: req.user._id,
        content: req.body.comment,
    };
    const comment = yield comment_model_1.default.create(commentObj);
    if (!comment)
        return next(new appError_1.default('Something went wrong', 409));
    yield post_model_1.default.updateOne({ _id: comment.postId }, { $push: { comments: comment._id } });
    res.status(201).json({
        'Comment-ID': comment._id,
    });
}));
exports.default = createComment;
