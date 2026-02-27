import dotenv from 'dotenv';
import app from './app.js';
import { connect } from 'node:http2';
import connectDB from './libs/db.js';

dotenv.config();
connectDB()

try {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`App listening on port ${process.env.PORT || 5000}`);
    })
} catch (error) {
    console.log("error while listening:", error);
}