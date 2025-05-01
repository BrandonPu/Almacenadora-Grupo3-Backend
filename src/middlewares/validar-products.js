import  Product from '../products/product.model.js';
import Category from '../categories/category.model.js';
import Supplier from '../supplier/supplier.model.js';


export const existProductPerName = async (req, res, next) => {

    const { nameProduct } = req.body;

    try {

        const existingProduct = await Product.findOne({ nameProduct: nameProduct.trim() });

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

export const validarNombreProductoUnico = async (req, res, next) => {
    try {
        const { nameProduct } = req.body;

        if (!nameProduct || typeof nameProduct !== 'string') {
            return res.status(400).json({
                success: false,
                msg: 'The product name is required.',
            });
        }

        const productoExistente = await Product.findOne({
            nameProduct: nameProduct.trim(),
            state: true
        });

        if (productoExistente) {
            return res.status(400).json({
                success: false,
                msg: `the name"${nameProduct}"already exists in the database.`,
            });
        }

        next();

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'there was an error.',
            error: error.message,
        });
    }
};

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

