import { Router } from 'express'
import userControllers from '../controllers/userControllers.js'

const router = Router()

router.post("/signin", userControllers.signin);
router.post("/signup", userControllers.signup);

export default router