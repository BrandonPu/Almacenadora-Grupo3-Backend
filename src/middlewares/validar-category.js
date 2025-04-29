import Category from "../categories/category.model.js";

export const existingNameCategory = async (req, res, next) => {
    try {
        const { nameCategory } = req.body;
        const category = await Category.findOne({ nameCategory: nameCategory.trim() });
        if (category) {
            return res.status(400).json({
                success: false,
                msg: 'Category already exists'
            });
        }
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error validating category',
            error: error.message
        })
    }
};