import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import * as dotenv from 'dotenv'
import { vehicleRoutes } from './routes/vehicles'

// Load environment variables
dotenv.config()

const app = new Hono()
const port = parseInt(process.env.PORT || '3000')

const origins = ['http://localhost:5173', 'http://localhost:5174']

app.use('/*', cors({
  origin: origins,
  credentials: true,
}))

// Mount routes
app.route('/api', vehicleRoutes)

console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
