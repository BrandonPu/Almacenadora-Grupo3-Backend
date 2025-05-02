import Supplier from "../supplier/supplier.model.js";
import Product from "../products/product.model.js";

export const existingSupplier = async (req, res, next) => {
    try {
        const { emailSupplier } = req.body;
        const supplier = await Supplier.findOne({ emailSupplier: emailSupplier.trim()});
        if (supplier) {
            return res.status(400).json({
                success: false,
                msg: 'Supplier already exists'
            });
        }
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error validating supplier',
            error: error.message
        })
    }
};  

export const validateUniquePhoneNumber = async (req, res, next) => {
    try {
        const { phoneNumber } = req.body;
        const existingSupplier = await Supplier.findOne({ phoneNumber });

        if (existingSupplier) {
            return res.status(400).json({
                success: false,
                msg: 'Phone number already exists'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error validating phone number',
            error: error.message
        });
    }
};

export const validateProductForSupplier = async (req, res, next) => {
    try {
        const { nameProduct } = req.body;

        if (!nameProduct) {
            return res.status(400).json({
                success: false,
                msg: 'nameProduct is required'
            });
        }

        const product = await Product.findOne({ nameProduct: nameProduct.trim(), state: true });

        if (!product) {
            return res.status(404).json({
                success: false,
                msg: 'Product not found or is inactive'
            });
        }

        req.product = product; 
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error validating product',
            error: error.message
        });
    }
};

export const confirmAction = (req, res, next) => {
    const { confirmDeletion } = req.body;

    if (confirmDeletion !== true) {
        return res.status(400).json({
            success: false,
            msg: 'Action not confirmed.'
        });
    }

    next();
};