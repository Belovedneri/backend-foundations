import { Router } from 'express'
import { listTasks, getTask, createTask, patchTask, removeTask } from '../controllers/taskController.js'

const router = Router()

router.get('/', listTasks)
router.get('/:id', getTask)
router.post('/', createTask)
router.patch('/:id', patchTask)
router.delete('/:id', removeTask)

export default router