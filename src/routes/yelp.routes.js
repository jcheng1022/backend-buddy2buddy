import express from 'express';
import authGate from '../middleware/authGate';
import YelpController from "../controllers/yelp.controllers";

const yelpRouter = express.Router();

yelpRouter.post('/', authGate, YelpController.searchBusinesses)
yelpRouter.get('/interest', authGate, YelpController.getInterestsByUser)

yelpRouter.post('/interest/:type', authGate, YelpController.toggleInterest)





export default yelpRouter;
