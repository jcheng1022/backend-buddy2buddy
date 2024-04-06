import express from 'express';
import authGate from '../middleware/authGate';
import ActivityController from "../controllers/activity.controllers";
import multer from 'multer';

const upload = multer();


const activityRouter = express.Router();

activityRouter.get('/', authGate, ActivityController.getActivityHistoryByUser)

activityRouter.post('/', authGate, upload.single('image'), ActivityController.createNewActivity)

activityRouter.get('/feed', authGate, ActivityController.getActivityFeedForUser)

activityRouter.delete('/:activityId', authGate, ActivityController.removeActivityById)








export default activityRouter;
