import { ChatOpenAI } from '@langchain/openai'
import { toBaseMessages, toUIMessageStream } from '@ai-sdk/langchain'
import { UIMessage } from 'ai'

export async function streamChat(messages: UIMessage[]) {
  const model = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0.7
  });

  // Convert AI SDK UIMessages to LangChain messages
  const langchainMessages = await toBaseMessages(messages);

  // Stream the response from the model
  const stream = await model.stream(langchainMessages);

  // Convert the LangChain stream to UI message stream
  return toUIMessageStream(stream);
}