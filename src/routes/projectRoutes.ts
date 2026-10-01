import { Router } from 'express'
import { createProject, listProjects, getProject, patchProject, removeProjectHandler } from '../controllers/projectController.js'

const router = Router()

router.post('/', createProject)
router.get('/', listProjects)
router.get('/:id', getProject)
router.patch('/:id', patchProject)
router.delete('/:id', removeProjectHandler)

export default router