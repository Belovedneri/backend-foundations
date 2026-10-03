import { Router } from 'express'
import { patchTask, removeTaskHandler } from '../controllers/taskController.js'

const router = Router()

router.patch('/:id', patchTask)
router.delete('/:id', removeTaskHandler)

export default router