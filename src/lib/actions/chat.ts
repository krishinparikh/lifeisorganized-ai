"use server"

import { ChatOpenAI } from '@langchain/openai'
import { RAGService } from '@/lib/rag'

export async function streamChat(message: string) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Initialize the chat model
        const model = new ChatOpenAI({
          openAIApiKey: process.env.OPENAI_API_KEY,
          modelName: 'gpt-4-turbo-preview',
          streaming: true,
        })

        // Retrieve context from RAG
        const ragService = RAGService.getInstance()
        const contextDocs = await ragService.retrieveContext(message)
        const context = ragService.formatContext(contextDocs)

        // Build the prompt with context
        const promptWithContext = context
          ? `Context:\n${context}\n\nQuestion: ${message}`
          : message

        // Stream the response
        const streamResponse = await model.stream(promptWithContext)

        for await (const chunk of streamResponse) {
          const text = chunk.content
          controller.enqueue(encoder.encode(text))
        }

        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
  })

  return stream
}