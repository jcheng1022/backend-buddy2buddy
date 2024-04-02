import express from 'express';
import authGate from '../middleware/authGate';
import YelpController from "../controllers/yelp.controllers";

const servicesRouter = express.Router();

servicesRouter.get('/search',  YelpController.searchBusinesses)






export default servicesRouter;
