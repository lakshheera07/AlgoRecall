import cors from 'cors'
import express from 'express'
import problemsRouter from './routes/problemsRoutes.js'
import recallRouter from './routes/recallRoutes.js'
import revisionRouter from './routes/revisionRoutes.js'
import dotenv from 'dotenv'
import swaggerSpec from './swagger.js'
import swaggerUi from 'swagger-ui-express'


dotenv.config()

const app = express()
const PORT = Number.parseInt(process.env.PORT ?? '5000', 10)

app.use(cors())
app.use(express.json())
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get('/api/health', (_request, response) => {
  response.status(200).json({ status: 'ok' })
})

app.use('/api/problems', problemsRouter)
app.use('/api/recall', recallRouter)
app.use('/api/revision', revisionRouter)

app.use((_request, response) => {
  response.status(404).json({ error: 'Route not found' })
})

app.use((error, _request, response, _next) => {
  console.error(error)
  response.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`AlgoRecall API running on port ${process.env.PORT}`)
})
