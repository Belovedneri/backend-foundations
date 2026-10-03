import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { validate } from '../middleware/validate.js'
import { updateTaskSchema } from '../validators/taskValidators.js'
import { patchTask, removeTaskHandler } from '../controllers/taskController.js'

const router = Router()

router.patch('/:id', authenticate, validate(updateTaskSchema), patchTask)
router.delete('/:id', authenticate, removeTaskHandler)

export default router