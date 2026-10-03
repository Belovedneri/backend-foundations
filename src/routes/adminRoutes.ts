import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { requireAdmin } from '../middleware/requireAdmin.js'
import { listAllUsers } from '../controllers/userController.js'

const router = Router()

router.get('/users', authenticate, requireAdmin, listAllUsers)

export default router