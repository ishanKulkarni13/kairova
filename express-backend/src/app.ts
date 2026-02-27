import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from 'cors'
import tempRouter from './routes/temp.js';
import { initializePassport } from './auth/passport.js';
import session from 'express-session';
import passport from 'passport';

const app = express()

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is missing");
}


initializePassport();

app.use(cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
    methods:'GET,POST,PUT,DELETE',
    credentials: true
}));


app.use(express.json())

// session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());



app.use("/temp", tempRouter)


export default app;
