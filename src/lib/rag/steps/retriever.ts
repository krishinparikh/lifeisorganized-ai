import { Document } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import { getVectorStore } from "./vector-store";

/**
 * Retrieves relevant documents from Pinecone based on semantic similarity
 */
export async function retrieveDocuments(
  query: string,
  k: number = 4,
  namespace?: string
): Promise<Document[]> {
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
    dimensions: 1024
  });

  const vectorStore = await getVectorStore(embeddings, namespace);
  const documents = await vectorStore.similaritySearch(query, k);

  return documents;
}

/**
 * Formats retrieved document chunks into a context string
 */
export function formatChunks(documents: Document[]): string {
  if (documents.length === 0) {
    return "No relevant context found.";
  }

  const formattedChunks = documents
    .map((doc, index) => {
      const { filename, episodeNumber, source } = doc.metadata;
      const header = episodeNumber
        ? `[Episode ${episodeNumber} - ${filename}]`
        : `[${filename || source || "Unknown source"}]`;

      return `Context ${index + 1}:\n${header}\n${doc.pageContent}\n`;
    })
    .join("\n---\n\n");

  return formattedChunks;
}