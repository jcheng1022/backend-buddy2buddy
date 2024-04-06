import express from 'express';
import UserController from '../controllers/users.controllers'
import authGate from '../middleware/authGate';

const userRouter = express.Router();

userRouter.get('/me', authGate, UserController.getCurrentUser)




export default userRouter;
