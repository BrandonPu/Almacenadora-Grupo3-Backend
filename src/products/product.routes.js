import { Router } from "express";
import { addProduct } from "./product.controller.js";
import { existProductPerName } from "../middlewares/validar-products.js";

const router = Router();

router.post(
    '/addProduct',
    existProductPerName,
    addProduct
);

export default router;