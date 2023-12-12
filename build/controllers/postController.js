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
exports.unlikePost = exports.likePost = exports.deletePost = exports.getFeed = exports.getAllPosts = exports.getPost = exports.createPost = void 0;
const mongoose_1 = require("mongoose");
const post_model_1 = __importDefault(require("../models/post.model"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const config_1 = require("../config/config");
/**
 * @swagger
 * tags:
 *   name: post
 *   description: api for post management
 * /api/posts:
 *   post:
 *     summery: create new post
 *     tags: [post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: awesome post
 *               description:
 *                 type: string
 *                 example: post description
 *     responses:
 *       201:
 *         description: successful post creation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Post-Id:
 *                   type: string
 *                 Title:
 *                   type: string
 *                 Description:
 *                   type: string
 *                 image:
 *                   type: string
 *                 Created Time:
 *                   type: string
 *                   format: date-time
 *
 */
exports.createPost = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.title) {
        return next(new appError_1.default('Please pass post title', 400));
    }
    if (!req.body.description) {
        return next(new appError_1.default('Please pass post description', 400));
    }
    const postObj = {
        userId: req.user._id,
        title: req.body.title,
        description: req.body.description,
    };
    if (req.file) {
        postObj.image = `http://localhost:${config_1.PORT}/${req.file.filename}`;
    }
    console.log('postObj: ', postObj);
    const post = yield post_model_1.default.create(postObj);
    if (!post)
        return next(new appError_1.default('Something went wrong', 409));
    res.status(201).json({
        'Post-Id': post._id,
        Title: post.title,
        Description: post.description,
        image: post.image,
        'Created Time': post.createdAt,
    });
}));
/**
 * @swagger
 * /api/posts/{postId}:
 *   get:
 *     summery: get post by id
 *     tags: [post]
 *     parameters:
 *       - in: params
 *         name: postId
 *         type: string
 *         example: 64dc6a450b3f317aa89fc732
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: get post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 likes:
 *                   type: number
 *                 comments:
 *                   type: number
 *
 */
exports.getPost = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_model_1.default.aggregate([
        {
            $match: {
                _id: new mongoose_1.Types.ObjectId(req.params.postId),
            },
        },
        {
            $project: {
                title: 1,
                description: 1,
                likes: { $size: '$likes' },
                comments: { $size: '$comments' },
            },
        },
    ]);
    console.log('hfgh');
    if (post.length === 0)
        return next(new appError_1.default('Could not find the post', 404));
    res.status(200).json(post[0]);
}));
exports.getAllPosts = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield post_model_1.default.aggregate([
        {
            $match: {
                userId: req.user._id,
            },
        },
        {
            $lookup: {
                from: 'comments',
                localField: 'comments',
                foreignField: '_id',
                as: 'comments',
            },
        },
        {
            $addFields: {
                desc: '$description',
                likes: { $size: '$likes' },
                created_at: '$createdAt',
                id: '$_id',
            },
        },
        {
            $sort: { createdAt: -1 },
        },
        {
            $project: {
                id: 1,
                title: 1,
                desc: 1,
                created_at: 1,
                comments: 1,
                likes: 1,
            },
        },
    ]);
    res.status(200).json({ status: 'success', posts });
}));
/**
 * @swagger
 * /api/feed:
 *   get:
 *     summery: get feed
 *     tags: [post]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: successful post creation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       desc:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       likes:
 *                         type: number
 *                       comments:
 *                         type: object
 *
 *
 */
exports.getFeed = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield post_model_1.default.aggregate([
        {
            $match: {
                userId: { $in: req.user.following }
            }
        },
        {
            $lookup: {
                from: 'comments',
                localField: 'comments',
                foreignField: '_id',
                as: 'comments',
            },
        },
        {
            $addFields: {
                desc: '$description',
                likes: { $size: '$likes' },
                created_at: '$createdAt',
                id: '$_id',
            },
        },
        {
            $sort: { createdAt: -1 },
        },
        {
            $project: {
                id: 1,
                title: 1,
                desc: 1,
                created_at: 1,
                comments: 1,
                likes: 1,
            },
        },
    ]);
    res.status(200).json({ status: 'success', posts });
}));
/**
 * @swagger
 * /api/posts/{postId}:
 *   delete:
 *     summery: delete a post
 *     tags: [post]
 *     parameters:
 *       - in: params
 *         name: postId
 *         type: string
 *         example: 64dc6a450b3f317aa89fc732
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: successful post deletion
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
 *                   example: Post deleted successfully
 */
exports.deletePost = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const post = yield post_model_1.default.findById(req.params.postId);
    console.log('post:', post);
    if (!post)
        return next(new appError_1.default('Could not find the post', 404));
    if (((_a = post.userId) === null || _a === void 0 ? void 0 : _a.toString()) !== req.user._id.toString()) {
        return next(new appError_1.default('you can not delete others post', 401));
    }
    yield post_model_1.default.findByIdAndDelete(req.params.postId);
    res.status(200).json({ status: 'success', message: 'Post deleted successfully' });
}));
/**
 * @swagger
 * /api/like/{postId}:
 *   get:
 *     summery: like a post
 *     tags: [post]
 *     parameters:
 *       - in: params
 *         name: postId
 *         type: string
 *         example: 64dc6a450b3f317aa89fc732
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: successful post like
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
 *                   example: Post liked successfully
 */
exports.likePost = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_model_1.default.findByIdAndUpdate(req.params.postId, {
        $addToSet: { likes: req.user._id },
        $pull: { unlikes: req.user._id },
    });
    if (!post)
        return next(new appError_1.default('Could not find the post', 404));
    res.status(200).json({ status: 'success', message: 'Post liked successfully' });
}));
/**
 * @swagger
 * /api/unlike/{postId}:
 *   get:
 *     summery: unlike a post
 *     tags: [post]
 *     parameters:
 *       - in: params
 *         name: postId
 *         type: string
 *         example: 64dc6a450b3f317aa89fc732
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: successful post unlike
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
 *                   example: Post disliked successfully
 */
exports.unlikePost = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_model_1.default.findByIdAndUpdate(req.params.postId, {
        $addToSet: { unlikes: req.user._id },
        $pull: { likes: req.user._id },
    });
    if (!post)
        return next(new appError_1.default('Could not find the post', 404));
    res.status(200).json({ status: 'success', message: 'Post disliked successfully' });
}));
