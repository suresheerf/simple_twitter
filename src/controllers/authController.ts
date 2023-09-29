import { sign } from 'jsonwebtoken';
import { hash, compare } from 'bcrypt';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/config';
import User from '../models/user.model';

const signToken = (id) =>
  sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
const createSendToken = (user, statusCode, req, res) => {
  console.log('sending token');
  const token = signToken(user._id);
  res.status(statusCode).json({
    token,
  });
};
export const signin = catchAsync(async (req, res, next) => {
  console.log('body:', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('please provide email and password', 400));
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('Could not find the user with given email', 404));
  }
  const pass = await hash(password, 12);
  console.log('pass:', pass);
  const isCorrect = await compare(password, user.password);

  console.log('isCorrect:', isCorrect);
  if (isCorrect) {
    createSendToken(user, 200, req, res);
  } else {
    next(new AppError('Please enter correct password', 400));
  }
});

export const signup = catchAsync(async (req, res, next) => {
  console.log('body:', req.body);
  const { email, password, name } = req.body;

  if (!email || !password) {
    return next(new AppError('please provide email and password', 400));
  }
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return next(new AppError('Email already taken please use another', 404));
  }
  const newUser = await User.create({ email, password, name });

  createSendToken(newUser, 200, req, res);
});