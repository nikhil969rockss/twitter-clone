import express from "express";
import dotenv from "dotenv";
import authRoutes from './routes/auth.routes.js'
import connectToDB from "./db/connectToMongoDB.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();



const port = process.env.PORT || 4000;

app.use(express.json()); // To parse the req.body
app.use(express.urlencoded({extended:true})); // to parse the form data(urlencoded)

app.use(cookieParser()); // To parse the cookie data

app.use('/api/auth', authRoutes)

connectToDB(()=>{
    app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}/`);
});
})
