import { useState, useEffect } from 'react'
import { createPrompt, updatePrompt } from '../services/api'

export default function PromptForm({ prompt, categories, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: ''
  })
  const [newCategory, setNewCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (prompt) {
      setFormData({
        title: prompt.title,
        category: prompt.category,
        content: prompt.content
      })
    }
  }, [prompt])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const categoryToUse = formData.category || newCategory
    if (!formData.title.trim() || !formData.content.trim() || !categoryToUse.trim()) {
      setError('All fields are required')
      return
    }

    const dataToSave = { ...formData, category: categoryToUse }

    try {
      setLoading(true)
      if (prompt) {
        await updatePrompt(prompt._id, dataToSave)
      } else {
        await createPrompt(dataToSave)
      }
      onSuccess()
    } catch (err) {
      setError(err.message || 'An error occurred')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const allCategories = newCategory
    ? [...categories, newCategory]
    : categories

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {prompt ? 'Edit Prompt' : 'Create New Prompt'}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter prompt title"
                className="input-field"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="flex gap-2">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field flex-1"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  {newCategory && <option value={newCategory}>{newCategory}</option>}
                </select>
              </div>
              <p className="text-xs text-gray-500 mt-1">Or type a new category below</p>
              <input
                type="text"
                placeholder="Create new category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="input-field mt-2"
              />
              {newCategory && (
                <p className="text-xs text-blue-600 mt-1">New category: "{newCategory}"</p>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Enter prompt content"
                rows="6"
                className="input-field resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {loading ? 'Saving...' : prompt ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
