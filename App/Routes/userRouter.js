const userController = require('../Controllers/userController');

const userRouter = require('express').Router();

userRouter.get('/', userController.getUsers);
userRouter.post('/', userController.postUser);

module.exports = userRouter;
