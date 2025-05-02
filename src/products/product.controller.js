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
    const {limite = 100, desde = 0} = req.query;
    const query = req.productQuery;

    try {
        
        const product = await Product.find(query)
            .populate({path: 'keeperCategory', match: {state:true}, select: 'nameCategory'})
            .populate({path: 'keeperSupplier', match: {state:true}, select: 'nameSupplier'})
            .skip(Number(desde))
            .limit(Number(limite));

        const total = await Product.countDocuments(query);

        const totalProductsValue = product.reduce((acc, item) => {
            return acc + (item.stock * item.price);
        }, 0);

        res.status(200).json({
            succes: true,
            total,
            totalProductsValue,
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

    try {

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

        const category = await Category.findOne({ nameCategory: data.nameCategory, state: true });

        const product = await Product.findByIdAndUpdate(
            id,
            { ...data, keeperCategory: category._id },
            { new: true }
        );

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
            modify: [{
                productId: id,
                quantity,
                date: new Date()
            }],
            state: true
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
            .populate({ path: 'modify.productId', select: 'nameProduct' })
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

export const getProductMovementsSummary = async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({
            success: false,
            msg: 'Start and end dates are required.'
        });
    }

    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const products = await Product.find({ state: true });

        let totalEntries = 0;
        let totalExits = 0;

        products.forEach(product => {
            const entries = product.registrationEntryRecord.filter(record => {
                const date = new Date(record.date);
                return date >= start && date <= end;
            });
            totalEntries += entries.reduce((sum, r) => sum + r.quantity, 0);

            const exits = product.purchaseRecord.filter(record => {
                const date = new Date(record.date);
                return date >= start && date <= end;
            });
            totalExits += exits.reduce((sum, r) => sum + r.quantity, 0);
        });

        res.status(200).json({
            success: true,
            summary: {
                startDate,
                endDate,
                totalProductEntries: totalEntries,
                totalProductExits: totalExits
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error generating product movement summary',
            error: error.message
        });
    }
};


export const mostActiveProducts = async (req, res) => {
    try {
        const mostEntries = await Product.aggregate([
        { $unwind: '$registrationEntryRecord' },
        {
            $group: {
            _id: '$_id',
            nameProduct: { $first: '$nameProduct' },
            totalEntries: { $sum: '$registrationEntryRecord.quantity' }
            }
        },
        { $sort: { totalEntries: -1 } },
        { $limit: 5 }
        ]);
        const mostExits = await Product.aggregate([
        { $unwind: '$purchaseRecord' },
        {
            $group: {
            _id: '$_id',
            nameProduct: { $first: '$nameProduct' },
            totalExits: { $sum: '$purchaseRecord.quantity' }
            }
        },
        { $sort: { totalExits: -1 } },
        { $limit: 5 }
        ]);

        res.status(200).json({
        success: true,
        mostEntries,
        mostExits
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        msg: 'Error retrieving most active products',
        error: error.message
        });
    }
};


export const monthlyActivityStats = async (req, res) => {
    try {
        const entries = await EntryHistory.aggregate([
            { $unwind: "$modify" },
            {
                $group: {
                    _id: { $month: "$modify.date" },
                    totalEntries: { $sum: "$modify.quantity" }
                }
            },
            { $sort: { totalEntries: -1 } }
        ]);

        const exits = await ExitHistory.aggregate([
            { $match: { date: { $ne: null }, quantity: { $ne: null } } },
            {
                $group: {
                    _id: { $month: "$date" },
                    totalExits: { $sum: "$quantity" }
                }
            },
            { $sort: { totalExits: -1 } }
        ]);

        res.status(200).json({
            success: true,
            mostActiveEntryMonth: entries[0],
            leastActiveEntryMonth: entries[entries.length - 1],
            mostActiveExitMonth: exits[0],
            leastActiveExitMonth: exits[exits.length - 1]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error fetching monthly activity stats",
            error: error.message
        });
    }
};