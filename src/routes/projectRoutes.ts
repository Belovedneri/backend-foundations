import { Router } from 'express'
import { createProject, listProjects, getProject, patchProject, removeProjectHandler } from '../controllers/projectController.js'
import { createTaskForProject, listTasksForProject } from '../controllers/taskController.js'

const router = Router()

router.post('/', createProject)
router.get('/', listProjects)
router.get('/:id', getProject)
router.patch('/:id', patchProject)
router.delete('/:id', removeProjectHandler)

router.post('/:id/tasks', createTaskForProject)
router.get('/:id/tasks', listTasksForProject)

export default router