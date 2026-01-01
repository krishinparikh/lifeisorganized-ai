import { ChatOpenAI } from '@langchain/openai'
import { toBaseMessages, toUIMessageStream } from '@ai-sdk/langchain'
import { UIMessage } from 'ai'
import { SystemMessage, BaseMessage } from '@langchain/core/messages'
import { retrieveDocuments, formatChunks } from './rag/steps/retriever'
import { buildSystemPrompt, buildUserPrompt } from './prompts'

function extractTextContent(message: UIMessage): string {
  return message.parts
    .filter(part => part.type === 'text')
    .map(part => part.text)
    .join(' ');
}

async function convertToLangChainMessages(uiMessages: UIMessage[]): Promise<BaseMessage[]> {
  const lastMessage = uiMessages[uiMessages.length - 1];
  const query = extractTextContent(lastMessage);

  // Retrieve RAG context
  const chunks = await retrieveDocuments(query);
  const context = formatChunks(chunks);

  // Augment last message with context
  const augmentedMessages: UIMessage[] = [
    ...uiMessages.slice(0, -1),
    {
      ...lastMessage,
      parts: [
        {
          type: 'text',
          text: buildUserPrompt(context, query)
        }
      ]
    }
  ];

  return toBaseMessages(augmentedMessages);
}

export async function streamChat(messages: UIMessage[]) {
  const model = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0.7
  });

  // 1. Convert UIMessages to LangChain messages
  const baseMessages = await convertToLangChainMessages(messages);

  // 2. Construct messages with system prompt
  const systemMsg = new SystemMessage(buildSystemPrompt());
  const langchainMessages = [systemMsg, ...baseMessages];

  // 3. Stream response from model
  const stream = await model.stream(langchainMessages);

  // 4. Convert back to UI message stream
  return toUIMessageStream(stream);
}