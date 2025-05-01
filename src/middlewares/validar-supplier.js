import Supplier from "../supplier/supplier.model.js";

export const existingSupplier = async (req, res, next) => {
    try {
        const { emailSupplier } = req.body;
        const supplier = await Supplier.findOne({ emailSupplier: emailSupplier.trim().toLowerCase() });
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