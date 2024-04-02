import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import response from "./utils/response";
import Tasks from './models/Interests.model'
import userRouter from "./routes/users.routes";
import {yelpClient} from "./services/yelp";
import yelpRouter from "./routes/yelp.routes";
import plannerRouter from "./routes/planner.routes";
import NotificationService from "./services/core/notifications.services";
import servicesRouter from "./routes/services.routes";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 8080;

const knexStringcase = require('knex-stringcase');
const knex = require('knex')
const { Model } = require('objection')

const options = knexStringcase({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD
    },
    migrations: {
        tableName: 'migrations',
        directory: './migrations'
    }
})



const knexInstance = knex(options)
Model.knex(knexInstance)
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors())


app.use('/user', userRouter);
app.use('/yelp', yelpRouter);
app.use('/planner', plannerRouter);
app.use('/services', servicesRouter);








app.get('/', async (req, res) => {
    res.send('Hi!')
});

app.get('/yelp', async (req,res) => {

    let data = await yelpClient.search({
        term: 'arcades',
        location: 'new york, ny'
    })

    data = data.jsonBody.businesses


    return response(
        res, {
            code: 400,
            data
        }
    )
})
app.post('/test', async (req, res) => {
    await NotificationService.deliverNotification({
        ids: [7,8],
        senderId: 9,
        message: 'testing BAtch from sender 9',
        // senderId: 8
    })

    return response(
        res, {
            code: 400,
            message: 'test'
        }
    )
});




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
