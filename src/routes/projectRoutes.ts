import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { createProject, listProjects, getProject, patchProject, removeProjectHandler } from '../controllers/projectController.js'
import { createTaskForProject, listTasksForProject } from '../controllers/taskController.js'

const router = Router()

router.get('/', listProjects)
router.get('/:id', getProject)
router.post('/', authenticate, createProject)
router.patch('/:id', authenticate, patchProject)
router.delete('/:id', authenticate, removeProjectHandler)

router.post('/:id/tasks', authenticate, createTaskForProject)
router.get('/:id/tasks', listTasksForProject)

export default router