import express, { Application, Router } from "express";
import * as dotenv from "dotenv"
import router from "./router/router";
import mongoose from "mongoose";


const app: Application = express();
dotenv.config();
const PORT = process.env.PORT || 3000;



app.use(express.json());
app.use('/api', router);


async function start(){
    try {
        //mongoose.connect(process.env.DB_URL as string, () => console.log('Connected to DB'));
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}

start();