import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";
import {check} from "express-validator";

import { 
    addProduct, 
    productView, 
    deleteProduct, 
    updateProduct, 
    productEntryRegistration, 
    historyProductView, 
    productExitRegistration,
    productExpiringSoon,
    getProductMovementsSummary,
    mostActiveProducts,
    monthlyActivityStats 
} from "./product.controller.js";
import { existProductPerName, validarNombreProductoUnico, validarCategoriaExistente  } from "../middlewares/validar-products.js";

const router = Router();

router.post(
    '/addProduct',
    [
        existProductPerName,
        validarNombreProductoUnico,
        validarCategoriaExistente
    ],
    addProduct
);

router.get(
    '/productView',
    productView
);

router.get(
    '/productExpiringSoon',
    productExpiringSoon
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

router.put(
    '/productEntryRegistration/:id',
    [
        validarJWT,
        check("id", "No es un Id válido").isMongoId()
    ],
    productEntryRegistration
);

router.get(
    '/historyProductView',
    historyProductView
);

router.post(
    '/productExitRegistration/:id',
    [
        validarJWT,
        check("id", "No es un Id válido").isMongoId()
    ],
    productExitRegistration
);

router.get(
    '/productMovementsSummary',
    getProductMovementsSummary
);

router.get(
    '/mostActiveProducts',
    mostActiveProducts
);

router.get(
    '/productMovementsSummary',
    getProductMovementsSummary
);

router.get(
    '/monthlyActivityStats',
    monthlyActivityStats
);
export default router;