import PromptCard from './PromptCard'

export default function PromptList({ prompts, onEdit, onDelete, onLoadSuccess }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt._id}
          prompt={prompt}
          onEdit={onEdit}
          onDelete={onDelete}
          onLoadSuccess={onLoadSuccess}
        />
      ))}
    </div>
  )
}
