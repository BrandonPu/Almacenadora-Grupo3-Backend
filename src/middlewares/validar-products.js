import  Product  from "../products/product.model.js";

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
