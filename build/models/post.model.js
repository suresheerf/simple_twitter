"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        require: [true, 'Post must belong to a user'],
    },
    title: { type: String },
    description: { type: String },
    image: { type: String },
    likes: {
        type: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
        default: [],
    },
    unlikes: {
        type: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
        default: [],
    },
    comments: {
        type: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Comments' }],
        default: [],
    },
}, {
    timestamps: true,
});
const Post = mongoose_1.default.model('Post', postSchema);
exports.default = Post;
