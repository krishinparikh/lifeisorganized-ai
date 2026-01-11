'use server'

import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_API_KEY })

function splitIntoChunks(text: string, maxLength: number = 2000): string[] {
  const chunks: string[] = []
  for (let i = 0; i < text.length; i += maxLength) {
    chunks.push(text.slice(i, i + maxLength))
  }
  return chunks
}

export async function createRecord(date: Date, chatHistory: string[], email?: string): Promise<string> {
  // Create the page first
  const response = await notion.pages.create({
    parent: {
      type: 'database_id',
      database_id: process.env.NOTION_PAGE_ID!
    },
    properties: {
      'conversation_id': {
        title: [
          {
            text: {
              content: Date.now().toString()
            }
          }
        ]
      },
      'Date': {
        date: {
          start: date.toISOString().split('T')[0]
        }
      }
    }
  })

  // Add chat history as block children, splitting long messages into multiple blocks
  const blocks = chatHistory.flatMap(messageJson => {
    const chunks = splitIntoChunks(messageJson)
    return chunks.map(chunk => ({
      object: 'block' as const,
      type: 'paragraph' as const,
      paragraph: {
        rich_text: [
          {
            type: 'text' as const,
            text: {
              content: chunk
            }
          }
        ]
      }
    }))
  })

  await notion.blocks.children.append({
    block_id: response.id,
    children: blocks
  })

  return response.id
}

export async function updateChatHistory(
  pageId: string,
  chatHistory: string[]
): Promise<void> {
  // First, get existing blocks and delete them
  const existingBlocks = await notion.blocks.children.list({
    block_id: pageId
  })

  for (const block of existingBlocks.results) {
    if ('id' in block) {
      await notion.blocks.delete({
        block_id: block.id
      })
    }
  }

  // Add updated chat history as new blocks, splitting long messages into multiple blocks
  const blocks = chatHistory.flatMap(messageJson => {
    const chunks = splitIntoChunks(messageJson)
    return chunks.map(chunk => ({
      object: 'block' as const,
      type: 'paragraph' as const,
      paragraph: {
        rich_text: [
          {
            type: 'text' as const,
            text: {
              content: chunk
            }
          }
        ]
      }
    }))
  })

  await notion.blocks.children.append({
    block_id: pageId,
    children: blocks
  })
}


export async function updateEmail(
  pageId: string,
  email: string
): Promise<void> {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      'Email': {
        email: email
      }
    }
  })
}

