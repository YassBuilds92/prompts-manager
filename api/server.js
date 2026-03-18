import express from 'express'
import cors from 'cors'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import handler from './prompts.js'

// Load environment variables from .env.local
const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dirname, '..', '.env.local')

console.log('📍 Looking for .env.local at:', envPath)
try {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
      process.env[key.trim()] = value
    }
  })
  console.log('✅ Environment variables loaded from .env.local')
  console.log('   - MONGODB_URI:', process.env.MONGODB_URI ? '✓ SET' : '✗ NOT SET')
  console.log('   - VITE_API_URL:', process.env.VITE_API_URL ? '✓ SET' : '✗ NOT SET')
} catch (err) {
  console.warn('⚠️  Could not load .env.local:', err.message)
}

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Route all /api/prompts requests to the serverless handler
app.all('/api/prompts', async (req, res) => {
  await handler(req, res)
})

app.all('/api/prompts/:id', async (req, res) => {
  await handler(req, res)
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`✅ Backend API running on http://localhost:${PORT}`)
  console.log(`📝 Available at http://localhost:${PORT}/api/prompts`)
})
