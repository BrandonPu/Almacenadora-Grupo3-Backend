import { response } from "express";
import Product from './product.model.js';
import Category from '../categories/category.model.js';
import Supplier from '../supplier/supplier.model.js';

export const addProduct = async (req, res) => {
    try {
        
        const { nameProduct, ...data} = req.body; 
        
        const category = await Category.findOne({nameCategory: data.nameCategory});

        const product = new Product({
            nameProduct: nameProduct.trim(),
            ...data,
            keeperCategory: category._id,
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
            msg: 'Error creating category',
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
            msg: 'Error getting categories',
            error: error.message
        })
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
