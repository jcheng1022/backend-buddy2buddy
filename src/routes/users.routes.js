import express from 'express';
import UserController from '../controllers/users.controllers'
import authGate from '../middleware/authGate';

const userRouter = express.Router();

userRouter.get('/me', authGate, UserController.getCurrentUser)

userRouter.get('/profile', authGate, UserController.getUserProfile)

userRouter.get('/buddies', authGate, UserController.getUserFriends)
userRouter.patch('/buddies/:buddyId', authGate, UserController.updateBuddyRequest)
userRouter.get('/notifications', authGate, UserController.getUserNotifications)

userRouter.post('/buddies', authGate, UserController.sendBuddyRequest)


export default userRouter;
