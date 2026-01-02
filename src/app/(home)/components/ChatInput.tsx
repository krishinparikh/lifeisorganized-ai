"use client"

import { ArrowUp } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/src/components/ui/input-group"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
}

export function ChatInput({ value, onChange, onSubmit, disabled }: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <InputGroup className="rounded-full h-16 shadow-xl bg-white has-[[data-slot=input-group-control]:focus-visible]:!border-foreground/30 has-[[data-slot=input-group-control]:focus-visible]:!ring-0">
        <InputGroupInput
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ask Mridu's digital mind a question..."
          className="px-6 text-lg!"
          disabled={disabled}
        />
        <InputGroupAddon align="inline-end" className="px-5">
          <InputGroupButton
            type="submit"
            size="icon-sm"
            className="rounded-full h-10 w-10 bg-[#8c5287] text-primary-foreground hover:bg-[#be82b9] hover:text-primary-foreground hover:cursor-pointer"
            disabled={disabled}
          >
            <ArrowUp className="size-5" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}
