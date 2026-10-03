import express from 'express'
import taskRoutes from './routes/taskRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { requestLogger } from './middleware/requestLogger.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(requestLogger)
app.use(express.json())

app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, data: { status: 'ok' } })
})

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/projects', projectRoutes)
app.use('/tasks', taskRoutes)

app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' })
})

app.use(errorHandler)

export default app