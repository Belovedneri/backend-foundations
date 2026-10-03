import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { patchTask, removeTaskHandler } from '../controllers/taskController.js'

const router = Router()

router.patch('/:id', authenticate, patchTask)
router.delete('/:id', authenticate, removeTaskHandler)

export default router