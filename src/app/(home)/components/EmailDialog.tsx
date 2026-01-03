"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/src/components/ui/dialog"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/src/components/ui/input-group"

interface EmailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (email: string) => void
}

export function EmailDialog({ open, onOpenChange, onSubmit }: EmailDialogProps) {
  const [email, setEmail] = useState("")

  const handleSubmit = async () => {
    if (email.trim()) {
      await onSubmit(email)
      toast.success("Email sent!")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-12">
        <DialogHeader>
          <DialogTitle>Continue the dialogue</DialogTitle>
          <DialogDescription className="text-base">
            Share your email with me to receive a personal follow-up from this conversation!
          </DialogDescription>
        </DialogHeader>
        <InputGroup className="h-12">
          <InputGroupInput
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-base!"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size='icon-sm' variant={'default'} onClick={handleSubmit}>
              <Send className="size-4" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </DialogContent>
    </Dialog>
  )
}
