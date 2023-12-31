import { verify } from 'jsonwebtoken';
import { promisify } from 'util';

import User from '../models/user.model';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { JWT_SECRET } from '../config/config';

const protect = catchAsync(async (req, res, next) => {
  console.log('inside protect');
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('you are not logged in! please login to get access', 401));
  }

  const decode = await promisify(verify)(token, JWT_SECRET);
  console.log('decode:', decode);
  const user = await User.findById(decode.id);

  if (!user) return next(new AppError('user has been deleted', 400));
  console.log('userId:', user._id);

  req.user = user;
  res.locals.user = user;
  next();
});

export default protect;
