import { useState, useEffect } from 'react'
import PromptList from '../components/PromptList'
import PromptForm from '../components/PromptForm'
import CategoryFilter from '../components/CategoryFilter'
import { getPrompts } from '../services/api'

export default function App() {
  const [prompts, setPrompts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadPrompts()
  }, [])

  const loadPrompts = async () => {
    try {
      setLoading(true)
      const data = await getPrompts()
      setPrompts(data)
      const uniqueCategories = [...new Set(data.map(p => p.category))]
      setCategories(uniqueCategories)
      setError(null)
    } catch (err) {
      setError('Erreur lors du chargement des prompts')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredPrompts = selectedCategory
    ? prompts.filter(p => p.category === selectedCategory)
    : prompts

  const handleAddSuccess = () => {
    setShowForm(false)
    setEditingPrompt(null)
    loadPrompts()
  }

  const handleEdit = (prompt) => {
    setEditingPrompt(prompt)
    setShowForm(true)
  }

  const handleDelete = (promptId) => {
    setPrompts(prompts.filter(p => p._id !== promptId))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Prompts</h1>
              <p className="text-gray-500 mt-1">Organize and manage your prompts</p>
            </div>
            <button
              onClick={() => {
                setEditingPrompt(null)
                setShowForm(true)
              }}
              className="btn-primary flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              <span>New Prompt</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Prompts List */}
        {!loading && filteredPrompts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {selectedCategory
                ? `No prompts in "${selectedCategory}" category`
                : 'No prompts yet. Create one to get started!'}
            </p>
          </div>
        ) : (
          <PromptList
            prompts={filteredPrompts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onLoadSuccess={loadPrompts}
          />
        )}
      </main>

      {/* Form Modal */}
      {showForm && (
        <PromptForm
          prompt={editingPrompt}
          categories={categories}
          onClose={() => {
            setShowForm(false)
            setEditingPrompt(null)
          }}
          onSuccess={handleAddSuccess}
        />
      )}
    </div>
  )
}
