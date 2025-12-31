import type { UIMessage } from "ai"

export function ChatMessage({ message }: { message: UIMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="bg-muted rounded-2xl px-4 py-2 max-w-[80%]">
          {message.parts.map((part, index) => {
            if (part.type === 'text') {
              return <p key={index}>{part.text}</p>
            }
            return null
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start">
      <div className="rounded-2xl px-4 py-2 max-w-[80%]">
        {message.parts.map((part, index) => {
          if (part.type === 'text') {
            return <p key={index}>{part.text}</p>
          }
          return null
        })}
      </div>
    </div>
  )
}
