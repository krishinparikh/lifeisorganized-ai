import type { UIMessage } from "ai"
import Image from "next/image"

export function ChatMessage({ message }: { message: UIMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="bg-[#5cc7cd]/30 rounded-2xl px-4 py-2 max-w-[90%]">
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
    <div className="flex justify-start items-start gap-2">
      <Image
        src="/MriduIcon.jpg"
        alt="Assistant"
        width={32}
        height={32}
        className="rounded-full flex-shrink-0"
      />
      <div className="rounded-2xl px-2 max-w-[90%]">
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
