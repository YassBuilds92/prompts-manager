import { useState } from 'react'
import { deletePrompt } from '../services/api'

export default function PromptCard({ prompt, onEdit, onDelete, onLoadSuccess }) {
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${prompt.title}"?`)) return

    try {
      setDeleting(true)
      await deletePrompt(prompt._id)
      onDelete(prompt._id)
      onLoadSuccess()
    } catch (error) {
      alert('Error deleting prompt')
      console.error(error)
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="card p-6 flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 flex-1">{prompt.title}</h3>
          <span className="text-xs font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full ml-2 flex-shrink-0">
            {prompt.category}
          </span>
        </div>
        <p className="text-xs text-gray-400">{formatDate(prompt.createdAt)}</p>
      </div>

      {/* Content Preview */}
      <p className="text-gray-600 text-sm flex-1 mb-4 line-clamp-4 leading-relaxed">
        {prompt.content}
      </p>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={handleCopy}
          className="flex-1 btn-secondary text-sm flex items-center justify-center gap-2"
          title="Copy to clipboard"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {copied ? 'Copied!' : 'Copy'}
        </button>

        <button
          onClick={() => onEdit(prompt)}
          className="flex-1 btn-secondary text-sm flex items-center justify-center gap-2"
          title="Edit prompt"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="btn-danger flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
          title="Delete prompt"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}
