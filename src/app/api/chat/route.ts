import { createUIMessageStreamResponse, UIMessage } from 'ai';
import { streamChat } from '@/src/lib/chat';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const stream = await streamChat(messages);

  return createUIMessageStreamResponse({
    stream,
  });
}