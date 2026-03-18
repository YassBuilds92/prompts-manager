import mongoose from 'mongoose'

// MongoDB Connection String - will be set from environment variable
// Fallback: simplified connection string without SRV records
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://yayaben92y:p6zJ7i6ca68pyLtlU@cluster0.arodi.mongodb.net/prompts-db?retryWrites=true&w=majority&authSource=admin'

// Schema
const promptSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

let Prompt

// Initialize connection
async function initDB() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set')
  }

  if (!mongoose.connection.readyState) {
    console.log('🔌 Connecting to MongoDB...')
    try {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      })
      console.log('✅ Connected to MongoDB successfully')
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message)
      throw error
    }
  }

  if (!Prompt) {
    Prompt = mongoose.model('Prompt', promptSchema)
  }

  return Prompt
}

// Handler for Vercel serverless
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const PromptModel = await initDB()

    // GET /api/prompts - Get all prompts
    if (req.method === 'GET') {
      const prompts = await PromptModel.find().sort({ createdAt: -1 })
      return res.status(200).json(prompts)
    }

    // POST /api/prompts - Create new prompt
    if (req.method === 'POST') {
      const { title, category, content } = req.body

      if (!title || !category || !content) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const prompt = new PromptModel({
        title,
        category,
        content,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      await prompt.save()
      return res.status(201).json(prompt)
    }

    // Extract ID from URL for PUT and DELETE
    // Vercel passes the :id param as req.query.id when using rewrites
    const urlParts = req.url.split('?')[0].split('/')
    const promptId = req.query?.id || urlParts[urlParts.length - 1]

    // PUT /api/prompts/:id - Update prompt
    if (req.method === 'PUT') {
      if (!promptId || promptId === 'prompts') {
        return res.status(400).json({ error: 'Invalid prompt ID' })
      }

      const { title, category, content } = req.body

      if (!title || !category || !content) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const prompt = await PromptModel.findByIdAndUpdate(
        promptId,
        {
          title,
          category,
          content,
          updatedAt: new Date()
        },
        { new: true }
      )

      if (!prompt) {
        return res.status(404).json({ error: 'Prompt not found' })
      }

      return res.status(200).json(prompt)
    }

    // DELETE /api/prompts/:id - Delete prompt
    if (req.method === 'DELETE') {
      if (!promptId || promptId === 'prompts') {
        return res.status(400).json({ error: 'Invalid prompt ID' })
      }

      const prompt = await PromptModel.findByIdAndDelete(promptId)

      if (!prompt) {
        return res.status(404).json({ error: 'Prompt not found' })
      }

      return res.status(200).json({ success: true, message: 'Prompt deleted' })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
}
