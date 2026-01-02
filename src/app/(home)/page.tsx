"use client"

import { useState, useEffect } from "react"
import { Chat } from "./components/Chat"
import Image from "next/image"

export default function Home() {
  const [showChat, setShowChat] = useState(false)
  const [opacity, setOpacity] = useState(0)

  const handleFirstMessage = () => {
    setOpacity(0)
    setTimeout(() => {
      setShowChat(true)
      setOpacity(1)
    }, 200)
  }

  useEffect(() => {
    setOpacity(1)
  }, [])

  return (
    <div style={{ opacity }} className={`flex flex-col items-center h-screen overflow-hidden px-72 pb-10 transition-opacity duration-500 ${!showChat ? 'bg-gradient-to-b from-[#5cc7cd]/20 to-[#be82b9]/20 justify-center' : 'pt-12'}`}>
      <div className="absolute top-4 left-4">
        <Image src="/Logo.png" alt="Logo" width={120} height={100} />
      </div>
      {!showChat && (
        <div className="w-full max-w-3xl">
          <h1 className="text-4xl font-medium mb-8 text-center">Feeling overwhelmed?</h1>
        </div>
      )}
      <div className="w-full flex justify-center">
        <Chat onFirstMessage={handleFirstMessage} showInput={!showChat} />
      </div>
    </div>
  );
}
