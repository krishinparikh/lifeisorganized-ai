"use client"

import { useState } from "react"
import { ChatInput } from "./components/ChatInput"
import { Chat } from "./components/Chat"

export default function Home() {
  const [showChat, setShowChat] = useState(false)

  return (
    <div className={`flex flex-col items-center min-h-screen px-72 ${!showChat ? 'justify-center gap-8' : 'pt-12'}`}>
      {!showChat && (
        <div className="w-full max-w-3xl pb-20">
          <h1 className="text-4xl font-medium mb-8 text-center">Feeling overwhelmed?</h1>
          <ChatInput onSubmit={() => setShowChat(true)} />
        </div>
      )}
      {showChat && (
        <div className="w-full flex justify-center">
          <Chat />
        </div>
      )}
    </div>
  );
}
