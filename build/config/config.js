"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_URL = exports.JWT_EXPIRES_IN = exports.JWT_SECRET = exports.PORT = exports.NODE_ENV = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.NODE_ENV = process.env.NODE_ENV || 'development';
exports.PORT = process.env.PORT || 3000;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
exports.DB_URL = process.env.DB_URL || '';
