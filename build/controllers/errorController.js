"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../utils/appError"));
const config_1 = require("../config/config");
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new appError_1.default(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors1 = Object.values(err.errors);
    const errors = errors1.map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new appError_1.default(message, 400);
};
const handleJsonWebTokenError = () => new appError_1.default('invalid token! please login agin', 401);
const handleJWTExpiredError = () => new appError_1.default('token expired! please login again', 401);
const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
};
const sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                title: 'something went wrong',
                message: err.message,
            });
        }
        console.log('Error:', err);
        return res.status(err.statusCode).json({
            title: 'something went wrong',
            message: 'Something went wrong,try again after some time.',
        });
    }
};
exports.default = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (config_1.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    }
    else if (config_1.NODE_ENV === 'production') {
        let error = Object.assign({}, err);
        error.message = err.message;
        if (error.name === 'CastError')
            error = handleCastErrorDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError')
            error = handleJsonWebTokenError();
        if (error.name === 'JWTExpiredError')
            error = handleJWTExpiredError();
        sendErrorProd(error, req, res);
    }
};
