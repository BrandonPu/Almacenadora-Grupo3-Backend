import { response } from "express";
import Product from './product.model.js';
import Category from '../categories/category.model.js';
import Supplier from '../supplier/supplier.model.js';

import EntryHistory from "./entryHistory.model.js";
import ExitHistory from "./exitHistory.model.js"

export const addProduct = async (req, res) => {
    try {
        
        const { nameProduct, ...data} = req.body; 
        
        const category = await Category.findOne({nameCategory: data.nameCategory});

        const product = new Product({
            nameProduct: nameProduct.trim(),
            ...data,
            keeperCategory: category._id
        });

        await product.save();
    
        await Category.findByIdAndUpdate(category._id, {
            $push: { keeperProduct: product._id}
        });

        res.status(200).json({
            succes: true,
            product
        });

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error creating product',
            error: error.message
        })
    }
};

export const productView = async (req, res) => {
    const {limite = 100, desde = 0, nameProduct, entryDate, keeperCategory} = req.query;
    const query = {state: true};

    try {

        if (nameProduct){
            query.nameProduct = {$regex: new RegExp(nameProduct, 'i')}
        }

        if (entryDate) {
            const start = new Date(entryDate);
            const end = new Date(entryDate);
            end.setHours(23, 59, 59, 999);

            query.entryDate = { $gte: start, $lte: end };
        }

        if (keeperCategory) {
            query.keeperCategory = keeperCategory;
        }

        
        const product = await Product.find(query)
            .populate({path: 'keeperCategory', match: {state:true}, select: 'nameCategory'})
            .populate({path: 'keeperSupplier', match: {state:true}, select: 'nameSupplier'})
            .skip(Number(desde))
            .limit(Number(limite));

        const total = await Product.countDocuments(query);

        res.status(200).json({
            succes: true,
            total,
            product
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error getting products',
            error: error.message
        })
    }
};

export const productExpiringSoon = async (req, res) => {
    const { month = 1, limite = 100, desde = 0 } = req.query;

    const today = new Date();
    const futureDate = new Date();
    futureDate.setMonth(today.getMonth() + Number(month));

    const query = {
        state: true,
        expirationDate: { $gte: today, $lte: futureDate }
    };

    try {
        const products = await Product.find(query)
            .populate({ path: 'keeperCategory', match: { state: true }, select: 'nameCategory' })
            .skip(Number(desde))
            .limit(Number(limite));

        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            msg: `Products expiring within ${month} month(s)`,
            total,
            products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error retrieving expiring products',
            error: error.message
        });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const { confirmDeletion } = req.body;

    try {
        if (!confirmDeletion) {
            return res.status(400).json({
                success: false,
                msg: 'Please confirm the deletion action'
            });
        }

        await Product.findByIdAndUpdate(id, { state: false });

        res.status(200).json({
            success: true,
            message: 'Product disabled.',
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error deleting Product',
            error: error.message,
        });
    }
};

export const updateProduct = async (req, res  = response) => {
    try {
        const {id} = req.params;
        const {_id, ...data} = req.body;
        data.state = true;

        const category = await Category.findOne({nameCategory: data.nameCategory});

        const product = await Product.findByIdAndUpdate(id, data, {new: true});

        await Category.findByIdAndUpdate(category._id, {
            $push: { keeperProduct: product._id}
        });

        res.status(200).json({
            succes: true,
            msj: 'Product updated successfully',
            product
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            msj: "Error updating product",
            error: error.message
        })
    }
};

export const productEntryRegistration = async (req, res  = response) => {
    try {
        const {id} = req.params;
        const { quantity, ...data } = req.body;
        data.state = true;

        const userId = req.usuario._id;

        const product = await Product.findByIdAndUpdate(
            id,
            {
                $inc: { stock: quantity },
                $push: { registrationEntryRecord: { quantity, date: new Date(), user: userId } },
                ...data,
                state: true
            },
            { new: true }
        );

        const history = new EntryHistory({
            keeperUser: userId,
            modify: [data], 
            state: true, 
        });

        await history.save();

        res.status(200).json({
            succes: true,
            msj: 'Product updated successfully',
            product
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            msj: "Error updating product",
            error: error.message
        })
    }
};

export const historyProductView = async (req, res) => {
    const {limite = 100, desde = 0} = req.query;
    const query = {state: true};

    try {
        
        const productHistoryEntry = await EntryHistory.find(query)
            .populate({path: 'keeperUser', match: {state:true}, select: 'name'})
            .skip(Number(desde))
            .limit(Number(limite));

        const total1 = await EntryHistory.countDocuments(query);

        const productHistoryExit = await ExitHistory.find(query)
            .populate({path: 'keeperUser', match: {state:true}, select: 'name'})
            .populate({path: 'productId', match: {state:true}, select: 'nameProduct'})
            .skip(Number(desde))
            .limit(Number(limite));

        const total2 = await ExitHistory.countDocuments(query);

        res.status(200).json({
            succes: true,
            total1,
            productHistoryEntry,
            total2,
            productHistoryExit
        });

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error getting categories',
            error: error.message
        })
    }
};


export const productExitRegistration = async (req, res = response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const userId = req.usuario._id;

        const product = await Product.findByIdAndUpdate(
            
            id,
            {
                $push: { purchaseRecord: { quantity: data.quantity, date: new Date(), user: userId } },
                ...data,
                state: true
            },
            { new: true }
        
        );

        const history = await ExitHistory.create({
                keeperUser: userId ,
                date: new Date(), 
                quantity: data.quantity,
                reason: data.reason,
                destination: data.destination,
                productId: id
        });

        await Product.findByIdAndUpdate(id, {$inc: { stock: -data.quantity }});

        res.status(200).json({
            success: true,
            msg: 'Product exit registered',
            product,
            history
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error processing product exit",
            error: error.message
        });
    }
};