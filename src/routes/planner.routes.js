import express from 'express';
import authGate from '../middleware/authGate';
import YelpController from "../controllers/yelp.controllers";
import yelpRouter from "./yelp.routes";
import PlannerController from "../controllers/planner.controllers";

const plannerRouter = express.Router();

plannerRouter.post('/', PlannerController.getEventsForPlanner)
plannerRouter.post('/plan', authGate, PlannerController.createNewPlan)
plannerRouter.patch('/plan/:planId/user', authGate, PlannerController.updatePlanInvite)


plannerRouter.get('/plan/:planId', authGate, PlannerController.getPlanById)
plannerRouter.post('/plan/:planId/plan-event', authGate, PlannerController.addPlanEvent)







export default plannerRouter;
