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
      <InputGroup className="rounded-full h-14 shadow">
        <InputGroupInput
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ask Mridu a question..."
          className="px-6 text-base!"
          disabled={disabled}
        />
        <InputGroupAddon align="inline-end" className="px-4">
          <InputGroupButton
            type="submit"
            size="icon-sm"
            className="rounded-full h-9 w-9 bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={disabled}
          >
            <ArrowUp className="size-5" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}
