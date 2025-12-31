"use client"

import { useState } from "react"
import { ChatMessage } from "./ChatMessage"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "user", content: "What's the weather like today?" },
    { role: "assistant", content: "I'm an AI assistant and don't have access to real-time weather data. You can check your local weather service or weather app for current conditions." },
    { role: "user", content: "Can you help me with my schedule?" },
    { role: "assistant", content: "Of course! I'd be happy to help you with your schedule. What would you like to do? Add an event, view your calendar, or something else?" },
  ])

  return (
    <div className="flex flex-col gap-4 w-full max-w-3xl">
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
    </div>
  )
}
