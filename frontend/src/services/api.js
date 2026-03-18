const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export const getPrompts = async () => {
  const response = await fetch(`${API_BASE}/prompts`)
  if (!response.ok) throw new Error('Failed to fetch prompts')
  return response.json()
}

export const createPrompt = async (prompt) => {
  const response = await fetch(`${API_BASE}/prompts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prompt)
  })
  if (!response.ok) throw new Error('Failed to create prompt')
  return response.json()
}

export const updatePrompt = async (id, prompt) => {
  const response = await fetch(`${API_BASE}/prompts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prompt)
  })
  if (!response.ok) throw new Error('Failed to update prompt')
  return response.json()
}

export const deletePrompt = async (id) => {
  const response = await fetch(`${API_BASE}/prompts/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Failed to delete prompt')
  return response.json()
}
