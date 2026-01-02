import type { UIMessage } from "ai"
import { Message, MessageContent, MessageResponse } from "@/src/components/ai-elements/message"
import { Fragment } from "react"
import Image from "next/image"

export function ChatMessage({ message }: { message: UIMessage }) {
  return (
    <div className="flex items-start gap-3 max-w-full">
      {message.role === "assistant" && (
        <Image
          src="/MriduIcon.jpg"
          alt="Assistant"
          width={32}
          height={32}
          className="rounded-full flex-shrink-0"
        />
      )}
      <Message from={message.role} className="flex-1 min-w-0">
        <MessageContent>
          {message.parts.map((part, index) => {
            if (part.type === 'text') {
              return (
                <Fragment key={index}>
                  <MessageResponse>{part.text}</MessageResponse>
                </Fragment>
              )
            }
            return null
          })}
        </MessageContent>
      </Message>
    </div>
  )
}
