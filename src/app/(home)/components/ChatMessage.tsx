type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

export function ChatMessage({ message }: { message: ChatMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="bg-muted rounded-2xl px-4 py-2 max-w-[80%]">
          <p>{message.content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start">
      <div className="rounded-2xl px-4 py-2 max-w-[80%]">
        <p>{message.content}</p>
      </div>
    </div>
  )
}
