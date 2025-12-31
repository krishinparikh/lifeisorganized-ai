"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"

interface ChatProps {
  onFirstMessage?: () => void
  showInput?: boolean
}

export function Chat({ onFirstMessage, showInput = true }: ChatProps) {
  const [input, setInput] = useState("")
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  })

  const handleSubmit = () => {
    if (input.trim()) {
      if (messages.length === 0 && onFirstMessage) {
        onFirstMessage()
      }
      sendMessage({ text: input })
      setInput("")
    }
  }

  if (showInput) {
    return (
      <div className="w-full max-w-3xl">
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          disabled={status !== "ready"}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen w-full max-w-3xl">
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pb-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      <div className="sticky bottom-0 bg-background pt-4 pb-6">
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          disabled={status !== "ready"}
        />
      </div>
    </div>
  )
}
