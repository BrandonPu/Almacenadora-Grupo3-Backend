import { response } from "express";
import Product from './product.model.js';
import Category from '../categories/category.model.js';
import Supplier from '../supplier/supplier.model.js';

export const addProduct = async (req, res) => {
    try {
        
        const { nameProduct, ...data} = req.body; 
        
        //const category = await Category.findOne({nameCategory: data.nameCategory});

        const product = new Product({
            nameProduct: nameProduct.trim(),
            ...data
            //keeperCategory: category._id,
        });

        await product.save();
    
        /*await Category.findByIdAndUpdate(category._id, {
            $push: { keeperProduct: product._id}
        });*/

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