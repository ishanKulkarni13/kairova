import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();


try {
    app.listen(process.env.PORT, () => {
        console.log(`App listening on port ${process.env.PORT}`);
    })
} catch (error) {
    console.log("error while listening:", error);
}