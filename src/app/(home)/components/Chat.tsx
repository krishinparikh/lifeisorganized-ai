"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"
import { EmailDialog } from "./EmailDialog"
import { Conversation, ConversationContent, ConversationScrollButton } from "@/src/components/ai-elements/conversation"
import { createRecord, updateChatHistory, updateEmail } from "@/src/lib/db/actions"
import { sendNotificationEmail } from "@/src/lib/gmail/actions"

interface ChatProps {
  onFirstMessage?: () => void
  showInput?: boolean
}

export function Chat({ onFirstMessage, showInput = true }: ChatProps) {
  const [input, setInput] = useState("")
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const pageIdRef = useRef<string | null>(null)
  const emailDialogShownRef = useRef(false)
  const pendingEmailRef = useRef<string | null>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    onFinish: async ({ messages: finishedMessages }) => {
      const chatHistory = finishedMessages.map(m => JSON.stringify({
        role: m.role,
        content: m.parts.filter(p => p.type === 'text').map(p => p.text).join(' ')
      }))

      if (!pageIdRef.current) {
        // Create initial record with first conversation
        const id = await createRecord(new Date(), chatHistory)
        pageIdRef.current = id

        // Send email notification with Notion page link
        const notionPageUrl = `https://www.notion.so/${id.replace(/-/g, '')}`
        await sendNotificationEmail(notionPageUrl)

        // If email was submitted before pageId was ready, update it now
        if (pendingEmailRef.current) {
          await updateEmail(id, pendingEmailRef.current)
          pendingEmailRef.current = null
        }
      } else {
        // Update existing record
        await updateChatHistory(pageIdRef.current, chatHistory)
      }
    }
  })

  const handleSubmit = () => {
    if (input.trim()) {
      const isFirstMessage = messages.length === 0

      if (isFirstMessage) {
        if (onFirstMessage) {
          onFirstMessage()
        }

        // Show email dialog 2 seconds after first message
        if (!emailDialogShownRef.current) {
          emailDialogShownRef.current = true
          setTimeout(() => {
            setShowEmailDialog(true)
          }, 2000)
        }
      }

      sendMessage({ text: input })
      setInput("")
    }
  }

  const handleEmailSubmit = async (email: string) => {
    if (pageIdRef.current) {
      await updateEmail(pageIdRef.current, email)
    } else {
      // Store email to be sent once pageId is available
      pendingEmailRef.current = email
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
    <>
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

      <EmailDialog open={showEmailDialog} onOpenChange={setShowEmailDialog} onSubmit={handleEmailSubmit} />
    </>
  )
}
