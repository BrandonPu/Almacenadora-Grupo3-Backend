import { response } from "express";
import Supplier from "./supplier.model.js";
import Product from "../products/product.model.js";


export const addSupplier = async (req, res = response) => {
    try {
        const data = req.body;

        const product = await Product.findOne({nameProduct: data.nameProduct});

        const supplier = new Supplier({
            nameSupplier: data.nameSupplier,
            emailSupplier: data.emailSupplier,
            phoneNumber: data.phoneNumber,
            keeperProduct: product._id
        });

        await supplier.save();

        await Product.findByIdAndUpdate(product._id, {
            $push: { keeperSupplier: supplier._id }
        });

        res.status(200).json({
            success: true,
            supplier
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error creating supplier",
            error: error.message
        });
    }
};


export const supplierView = async (req, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { state: true };

        const suppliers = await Supplier.find(query)

            .populate({path: 'keeperProduct', match: {state:true}, select: 'nameProduct'})
            .skip(Number(desde))
            .limit(Number(limite));

        const total = await Supplier.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            suppliers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error getting suppliers",
            error: error.message
        });
    }
};


export const updateSupplier = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, ...data } = req.body;

        const product = await Product.findOne({nameProduct: data.nameProduct});

        const supplierUpdated = await Supplier.findByIdAndUpdate(
            id,
            {
                $push: {  keeperProduct: product._id},
                ...data,
                state: true
            },
            { new: true }
        );

        await Product.findByIdAndUpdate(product._id, {
            $push: { keeperSupplier: supplierUpdated._id }
        });

        res.status(200).json({
            success: true,
            msg: "Supplier updated successfully",
            supplier: supplierUpdated
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error updating supplier",
            error: error.message
        });
    }
};


export const deleteSupplier = async (req, res = response) => {
    try {
        const { id } = req.params;

        const supplier = await Supplier.findByIdAndUpdate(
            id,
            { state: false },
            { new: true }
        );

        if (!supplier) {
            return res.status(404).json({
                success: false,
                msg: "Supplier not found"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Supplier disabled successfully",
            supplier
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error disabling supplier",
            error: error.message
        });
    }
};
