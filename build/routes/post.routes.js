"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importStar(require("multer"));
const express_1 = require("express");
const mime_types_1 = require("mime-types");
const auth_1 = __importDefault(require("../middleware/auth"));
const postController_1 = require("../controllers/postController");
const storage = (0, multer_1.diskStorage)({
    destination(req, file, cb) {
        cb(null, './public');
    },
    filename(req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}.${(0, mime_types_1.extension)(file.mimetype)}`);
    },
});
const upload = (0, multer_1.default)({ storage });
const router = (0, express_1.Router)();
router.post('/posts', auth_1.default, upload.single('image'), postController_1.createPost);
router.route('/posts/:postId').get(auth_1.default, postController_1.getPost).delete(auth_1.default, postController_1.deletePost);
router.get('/like/:postId', auth_1.default, postController_1.likePost);
router.get('/unlike/:postId', auth_1.default, postController_1.unlikePost);
router.get('/posts', auth_1.default, postController_1.getAllPosts);
router.get('/feed', auth_1.default, postController_1.getFeed);
exports.default = router;
