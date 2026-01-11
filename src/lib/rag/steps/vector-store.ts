import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { Embeddings } from "@langchain/core/embeddings";
import { Document } from "@langchain/core/documents";

/**
 * Stores documents in Pinecone vector store with batching to avoid token limits
 * OpenAI embeddings API has a limit of 300,000 tokens per request
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

  // Batch size: process 100 documents at a time to stay under token limits
  // Adjust this if you still hit limits (lower = safer but slower)
  const batchSize = 100;

  for (let i = 0; i < documents.length; i += batchSize) {
    const batch = documents.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(documents.length / batchSize)} (${batch.length} documents)`);

    await PineconeStore.fromDocuments(batch, embeddings, {
      pineconeIndex: index,
      namespace: namespace || "",
    });
  }
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

/**
 * Clears all vectors from a specific namespace
 */
export async function clearVectors(namespace: string): Promise<void> {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });

  const indexName = process.env.PINECONE_INDEX!;
  const index = pinecone.index(indexName);

  await index.namespace(namespace).deleteAll();
}