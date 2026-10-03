import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { validate } from '../middleware/validate.js'
import { createProjectSchema, updateProjectSchema } from '../validators/projectValidators.js'
import { createTaskSchema } from '../validators/taskValidators.js'
import { createProject, listProjects, getProject, patchProject, removeProjectHandler } from '../controllers/projectController.js'
import { createTaskForProject, listTasksForProject } from '../controllers/taskController.js'

const router = Router()

router.get('/', listProjects)
router.get('/:id', getProject)
router.post('/', authenticate, validate(createProjectSchema), createProject)
router.patch('/:id', authenticate, validate(updateProjectSchema), patchProject)
router.delete('/:id', authenticate, removeProjectHandler)

router.post('/:id/tasks', authenticate, validate(createTaskSchema), createTaskForProject)
router.get('/:id/tasks', listTasksForProject)

export default router