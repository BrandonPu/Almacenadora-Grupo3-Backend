import { response } from "express";
import Supplier from "./supplier.model.js";



export const addSupplier = async (req, res = response) => {
    try {
        const { nameSupplier, productSupplier, emailSupplier } = req.body;

        const exist = await Supplier.findOne({ emailSupplier: emailSupplier.trim() });
        if (exist) {
            return res.status(400).json({
                success: false,
                msg: "Email already exists"
            });
        }

        const supplier = new Supplier({
            nameSupplier: nameSupplier.trim(),
            productSupplier: productSupplier.trim(),
            emailSupplier: emailSupplier.trim()
        });

        await supplier.save();

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
        const { limite = 10, desde = 0, nameSupplier } = req.query;
        const query = { state: true };

        const filter = nameSupplier
            ? { ...query, nameSupplier: { $regex: nameSupplier, $options: "i" } }
            : query;

        const suppliers = await Supplier.find(filter)
            .skip(Number(desde))
            .limit(Number(limite));

        const total = await Supplier.countDocuments(filter);

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

        const updated = await Supplier.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: "Supplier updated successfully",
            supplier: updated
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
