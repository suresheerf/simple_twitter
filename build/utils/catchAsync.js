"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync = (func) => (req, res, next) => {
    func(req, res, next).catch((err) => next(err));
};
exports.default = catchAsync;
