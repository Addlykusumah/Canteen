import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import dotenv from 'dotenv';

const app = express();
app.listen(process.env.PORT, () => 
{
    console.log(`Server Up and Running on Port ${process.env.PORT}`);
});