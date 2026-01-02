"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"
import { Conversation, ConversationContent, ConversationScrollButton } from "@/src/components/ai-elements/conversation"

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
      <div className="w-full max-w-4xl">
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
    <div className="flex flex-col h-screen w-full max-w-4xl pb-24">
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="sticky bottom-0 bg-background">
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
