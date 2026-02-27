import dotenv from 'dotenv';
import express from "express";
import cors from 'cors'
import tempRouter from './routes/temp.js';


const app = express()
dotenv.config();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods:'GET,POST,PUT,DELETE',
    credentials: true
}));

app.use(express.json())

app.use("/temp", tempRouter)


export default app;
