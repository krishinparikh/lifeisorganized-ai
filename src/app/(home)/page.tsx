"use client"

import { useState } from "react"
import { Chat } from "./components/Chat"

export default function Home() {
  const [showChat, setShowChat] = useState(false)

  return (
    <div className={`flex flex-col items-center min-h-screen px-72 ${!showChat ? 'justify-center' : 'pt-12'}`}>
      {!showChat && (
        <div className="w-full max-w-3xl">
          <h1 className="text-4xl font-medium mb-8 text-center">Feeling overwhelmed?</h1>
        </div>
      )}
      <div className={`w-full flex justify-center ${!showChat ? '' : ''}`}>
        <Chat onFirstMessage={() => setShowChat(true)} showInput={!showChat} />
      </div>
    </div>
  );
}
