import { Router } from "express";
import { login, register} from "./auth.controller.js";
import { registerValidator, loginValidator } from "../middlewares/validator.js";
import { validateUserExistsEmail } from "../middlewares/validar-auth.js";
 
const router = Router();
 
router.post(
    '/login',
    loginValidator,
    validateUserExistsEmail,
    login
);
 
router.post(
    '/register',
    registerValidator,
    register
);

 
 
export default router;