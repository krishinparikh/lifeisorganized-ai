import { Embeddings } from "@langchain/core/embeddings";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";

/**
 * Embeds documents using the provided embeddings model
 * Extensible - accepts any LangChain Embeddings instance
 */
export async function embedDocuments(
  documents: Document[],
  embeddings: Embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  })
): Promise<number[][]> {
  const texts = documents.map((doc) => doc.pageContent);
  const vectors = await embeddings.embedDocuments(texts);
  return vectors;
}

/**
 * Embeds a single query string
 */
export async function embedQuery(
  query: string,
  embeddings: Embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  })
): Promise<number[]> {
  const vector = await embeddings.embedQuery(query);
  return vector;
}