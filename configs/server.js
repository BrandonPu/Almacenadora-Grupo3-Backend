'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import limiter from '../src/middlewares/validar-cant-peticiones.js'

import  { dbConnection } from './mongo.js';

import authRoutes from '../src/auth/auth.routes.js';
import productRoutes from '../src/products/product.routes.js';
import categoryRoutes from '../src/categories/category.routes.js';
import supplierRoutes from '../src/supplier/supplier.routes.js';
import userRoutes from '../src/users/user.routes.js';
import frecuentClientRoutes from '../src/frecuentClients/frecuentClient.routes.js';


const middlewares = (app) => {
    app.use(express.urlencoded({extended : false}));
    app.use(express.json());
    app.use(cors());
    app.use(helmet()); 
    app.use(morgan('dev'));
    app.use(limiter);
};

const routes = (app) => {
    app.use('/almacenadora/v1/auth', authRoutes);
    app.use('/almacenadora/v1/products', productRoutes);
    app.use('/almacenadora/v1/categories', categoryRoutes);
    app.use('/almacenadora/v1/suppliers', supplierRoutes);
    app.use('/almacenadora/v1/users', userRoutes);
    app.use('/almacenadora/v1/frecuentClients', frecuentClientRoutes);
};

export const conetarDB = async() => {
    try {
        await dbConnection();
        console.log('Database connected successfully');
    } catch (error) {
        console.log('Error connecting to database', error) 
    }
};

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3001;

    try {
        middlewares(app);
        conetarDB(app);
        routes(app);
        app.listen(port);
        console.log(`Server running on port ${port}`);
    } catch (error) {
        console.log(`Server init failed ${error}`)
    }
}

