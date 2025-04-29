import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";
import {check} from "express-validator";

import { addProduct, productView, deleteProduct, updateProduct } from "./product.controller.js";
import { existProductPerName } from "../middlewares/validar-products.js";

const router = Router();

router.post(
    '/addProduct',
    existProductPerName,
    addProduct
);

router.get(
    '/productView',
    productView
);

router.delete(
    '/deleteProduct/:id',
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "No es un Id válido").isMongoId()
    ],
    deleteProduct
);

router.put(
    '/updateProduct/:id',
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "No es un Id válido").isMongoId()
    ],
    updateProduct
);

export default router;