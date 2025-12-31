import { OpenAIEmbeddings } from '@langchain/openai'
import { Pinecone } from '@pinecone-database/pinecone'
import { PineconeStore } from '@langchain/pinecone'
import { Document } from '@langchain/core/documents'

export class RAGService {
  private static instance: RAGService
  private vectorStore: PineconeStore | null = null

  private constructor() {}

  static getInstance(): RAGService {
    if (!RAGService.instance) {
      RAGService.instance = new RAGService()
    }
    return RAGService.instance
  }

  async getVectorStore(): Promise<PineconeStore> {
    if (this.vectorStore) {
      return this.vectorStore
    }

    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    })

    const index = pinecone.Index(process.env.PINECONE_INDEX!)

    this.vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
      }),
      { pineconeIndex: index }
    )

    return this.vectorStore
  }

  async retrieveContext(query: string, k: number = 4): Promise<Document[]> {
    const vectorStore = await this.getVectorStore()
    const retriever = vectorStore.asRetriever({ k })
    return retriever.getRelevantDocuments(query)
  }

  formatContext(documents: Document[]): string {
    return documents
      .map((doc, idx) => `[${idx + 1}] ${doc.pageContent}`)
      .join('\n\n')
  }
}