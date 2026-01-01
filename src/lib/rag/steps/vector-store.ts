import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { Embeddings } from "@langchain/core/embeddings";
import { Document } from "@langchain/core/documents";

/**
 * Stores documents in Pinecone vector store
 */
export async function storeDocuments(
  documents: Document[],
  embeddings: Embeddings,
  namespace?: string
): Promise<void> {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });

  const indexName = process.env.PINECONE_INDEX!;
  const index = pinecone.index(indexName);

  await PineconeStore.fromDocuments(documents, embeddings, {
    pineconeIndex: index,
    namespace: namespace || "",
  });
}

/**
 * Returns a Pinecone vector store instance for querying
 */
export async function getVectorStore(
  embeddings: Embeddings,
  namespace?: string
): Promise<PineconeStore> {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });

  const indexName = process.env.PINECONE_INDEX!;
  const index = pinecone.index(indexName);

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
    namespace: namespace || "",
  });

  return vectorStore;
}