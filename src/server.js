import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import userRouter from "./routes/users.routes";
import activityRouter from './routes/activity.routes'
import admin from 'firebase-admin'
// import multer from 'multer';
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');

// const upload = multer();
dotenv.config();


let firebaseApp;
if (process.env.FIREBASE_ADMIN) {
    firebaseApp = initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN)),
        storageBucket: process.env.STORAGE_BUCKET
    })
    }

const db = getFirestore();


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

// app.use(upload.single('file'))



app.use('/user', userRouter);
app.use('/activity', activityRouter);









app.get('/', async (req, res) => {
    res.send('Hi!')
});

app.get('/test', async (req, res) => {

    res.send('test')
})



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
