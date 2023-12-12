"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        require: [true, 'Post must belong to a user'],
    },
    postId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Post' },
    content: { type: String },
}, {
    timestamps: true,
});
const Comment = mongoose_1.default.model('Comment', commentSchema);
exports.default = Comment;
