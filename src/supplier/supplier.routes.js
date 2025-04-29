import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";
import { existingSupplier } from "../middlewares/validar-supplier.js";

import {addSupplier,supplierView,updateSupplier,deleteSupplier} from "./supplier.controller.js";

const router = Router();


router.post(
  "/",
  [
    validarJWT,
    existingSupplier,
    validarCampos,
  ],
  addSupplier
);


router.get(
    "/", 
    supplierView);


router.put(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE"),
    check("id", "It is not a valid id").isMongoId(),
    validarCampos,
  ],
  updateSupplier
);


router.delete(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE"),
    check("id", "It is not a valid id").isMongoId(),
    validarCampos,
  ],
  deleteSupplier
);

export default router;
