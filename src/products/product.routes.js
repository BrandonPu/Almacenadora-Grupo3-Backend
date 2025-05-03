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
    productExitRegistrationClient,
    productExitRegistrationFrecuentClient,
    productExpiringSoon,
    getProductMovementsSummary,
    mostActiveProducts,
    monthlyActivityStats 
} from "./product.controller.js";
import { 
    existProductPerName, 
    validarCategoriaExistente ,
    validateProductExists,
    validateStockAndPrice,
    validateQuantityPositive,
    confirmAction,
    validateQueryParams,
    validateProductStockForExit
} from "../middlewares/validar-products.js";

const router = Router();

router.post(
    '/addProduct',
    [
        existProductPerName,
        validarCategoriaExistente,
        validateStockAndPrice,
    ],
    addProduct
);

router.get(
    '/productView',
    validateQueryParams,
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
        validateProductExists,
        confirmAction,
        check("id", "No es un Id válido").isMongoId()
    ],
    deleteProduct
);

router.put(
    '/updateProduct/:id',
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        validateProductExists,
        validarCategoriaExistente,
        validateStockAndPrice,
        check("id", "No es un Id válido").isMongoId()
    ],
    updateProduct
);

router.put(
    '/productEntryRegistration/:id',
    [
        validarJWT,
        validateQuantityPositive,
        check("id", "No es un Id válido").isMongoId()
    ],
    productEntryRegistration
);

router.get(
    '/historyProductView',
    historyProductView
);

router.post(
    '/productExitRegistrationClient/:id',
    [
        validarJWT,
        validateProductExists,
        validateQuantityPositive,
        validateProductStockForExit,
        check("id", "No es un Id válido").isMongoId()
    ],
    productExitRegistrationClient
);

router.post(
    '/productExitRegistrationFrecuentClient/:id',
    [
        validarJWT,
        validateProductExists,
        validateQuantityPositive,
        validateProductStockForExit,
        check("id", "No es un Id válido").isMongoId()
    ],
    productExitRegistrationFrecuentClient
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