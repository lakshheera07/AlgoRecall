import path from 'path'
import { fileURLToPath } from 'url'
import swaggerJSDoc from 'swagger-jsdoc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AlgoRecall API',
      version: '1.0.0',
      description: 'API documentation for AlgoRecall backend',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
    tags: [
      { name: 'Problems', description: 'CRUD operations for DSA problems' },
      { name: 'Recall', description: 'Recall logging and confidence tracking' },
      { name: 'Revision', description: 'Revision intelligence endpoints' },
    ],
    components: {
      schemas: {
        Problem: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            platform: { type: 'string', enum: ['LeetCode', 'GFG'] },
            dataStructure: { type: 'string' },
            pattern: { type: 'string' },
            difficulty: { type: 'string' },
            describeProblemInOwnWords: { type: 'string' },
            brute_force: { type: 'string', nullable: true },
            better_approach: { type: 'string', nullable: true },
            optimal_approach: { type: 'string', nullable: true },
            code: { type: 'string', nullable: true },
            nextRevisionAt: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, 'routes/*.js')],
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec
