import express, { Application } from "express";
import * as dotenv from "dotenv"
import router from "./router/router";
import mongoose from "mongoose";

import s from './models/CollectionSchema'
const app: Application = express();
dotenv.config();
const PORT = process.env.PORT || 3000;



app.use(express.json());
app.use('/api', router);


async function start(){
    try {
        //mongoose.set('debug', true);
        mongoose.connect(process.env.DB_URL as string, () => console.log('Connected to DB'));
        const update = {name:'DFG'};
        //await s.findOneAndUpdate({path:"E:\\TestTaskCRUD\\DiskStorage",name:'ASD'}, update);
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}

start();