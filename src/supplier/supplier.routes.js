import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";
import { existingSupplier, validateProductForSupplier, confirmAction, validateUniquePhoneNumber } from "../middlewares/validar-supplier.js";

import {addSupplier,supplierView,updateSupplier,deleteSupplier} from "./supplier.controller.js";

const router = Router();


router.post(
  "/addSuplier",
  [
    validarJWT,
    existingSupplier,
    validateProductForSupplier,
    validateUniquePhoneNumber,
    validarCampos,
  ],
  addSupplier
);


router.get(
    "/viewSuplier",
    supplierView);


router.put(
  "/updateSuplier/:id",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE"),
    validateProductForSupplier,
    check("id", "It is not a valid id").isMongoId(),
    validarCampos,
  ],
  updateSupplier
);


router.delete(
  "/deleteSupiler/:id",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE"),
    confirmAction,
    check("id", "It is not a valid id").isMongoId(),
    validarCampos,
  ],
  deleteSupplier
);

export default router;
