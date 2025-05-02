import {Router} from "express";
import {validarJWT} from "../middlewares/validar-jwt.js";
import {check} from "express-validator";
import {validarCampos} from '../middlewares/validar-campos.js';
import {tieneRole} from "../middlewares/validar-roles.js";

import {existingFrecuentClient, validateUniquePhoneNumber, confirmAction} from "../middlewares/validar-frecuentClient.js";

import {
    addFrecuentClient, 
    frecuentClientView, 
    updateFrecuentClient, 
    deleteFrecuentClient
} from "./frecuentClient.controller.js";

const router = Router();

router.post(
    "/addFrecuentClient",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        existingFrecuentClient,
        validateUniquePhoneNumber,
        validarCampos
    ],
    addFrecuentClient
);

router.get(
    "/frecuentClientView",
    frecuentClientView
);

router.put(
    "/updateFrecuentClient/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "No es un Id válido").isMongoId(),
        validarCampos
    ],
    updateFrecuentClient
);

router.delete(
    "/deleteFrecuentClient/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        confirmAction,
        check("id", "No es un Id válido").isMongoId(),
        validarCampos
    ],
    deleteFrecuentClient
);

export default router;