import  Product from '../products/product.model.js';
import Category from '../categories/category.model.js';


export const existProductPerName = async (req, res, next) => {

    const { nameProduct } = req.body;

    try {

        const existingProduct = await Product.findOne({ nameProduct: nameProduct.trim().toLowerCase() });

        if (existingProduct) {
            return res.status(400).json({
                success: false,
                msg: 'Product already exists'
            });
        }

        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Server error during user validation',
            error: error.message
        });
    }
}

export const validarCategoriaExistente = async (req, res, next) => {
    try {
        const { nameCategory } = req.body;

        if (!nameCategory) {
            return res.status(400).json({
                success: false,
                msg: 'The category name is required.',
            });
        }

        const categoria = await Category.findOne({ nameCategory, state: true });

        if (!categoria) {
            return res.status(404).json({
                success: false,
                msg: `The category "${nameCategory}"does not exist.`,
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error validating category.',
            error: error.message,
        });
    }
};

export const validateStockAndPrice = (req, res, next) => {
    const { stock, price } = req.body;

    if (stock < 1) {
        return res.status(400).json({
            success: false,
            msg: 'Stock must be at least 1.'
        });
    }

    if (price < 1) {
        return res.status(400).json({
            success: false,
            msg: 'Price must be at least 1.'
        });
    }

    next();
};

export const validateProductExists = async (req, res, next) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product || !product.state) {
            return res.status(404).json({
                success: false,
                msg: 'Product not found.'
            });
        }

        req.product = product;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error validating product existence.',
            error: error.message
        });
    }
};

export const validateQuantityPositive = (req, res, next) => {
    const { quantity } = req.body;

    if (quantity < 1) {
        return res.status(400).json({
            success: false,
            msg: 'Quantity must be at least 1.'
        });
    }

    next();
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

export const validateQueryParams = (req, res, next) => {
    const { nameProduct, entryDate, keeperCategory } = req.query;
    const query = { state: true };

    if (nameProduct) {
        query.nameProduct = { $regex: new RegExp(nameProduct, 'i') };
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

    req.productQuery = query;
    next();
};

export const validateProductStockForExit = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                msg: 'Product not found'
            });
        }

        if (product.stock <= 0) {
            return res.status(400).json({
                success: false,
                msg: 'Product stock is 0 — no more exits allowed'
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                msg: `Requested quantity (${quantity}) exceeds current stock (${product.stock})`
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error validating product stock',
            error: error.message
        });
    }
};