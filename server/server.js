import cors from 'cors'
import express from 'express'
import problemsRouter from './routes/problemsRoutes.js'

const app = express()
const PORT = Number.parseInt(process.env.PORT ?? '5000', 10)

app.use(cors())
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.status(200).json({ status: 'ok' })
})

app.use('/api/problems', problemsRouter)

app.use((_request, response) => {
  response.status(404).json({ error: 'Route not found' })
})

app.use((error, _request, response, _next) => {
  console.error(error)
  response.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`AlgoRecall API running on port ${PORT}`)
})
