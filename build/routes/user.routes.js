"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middleware/auth"));
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.post('/follow/:userId', auth_1.default, userController_1.followUser);
router.post('/unfollow/:userId', auth_1.default, userController_1.unfollowUser);
router.get('/user', auth_1.default, userController_1.getUser);
exports.default = router;
