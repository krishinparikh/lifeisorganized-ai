import { Document } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import { getVectorStore } from "./vector-store";

/**
 * Retrieves relevant documents from Pinecone based on semantic similarity
 * Can query multiple namespaces and returns top k results across all namespaces
 */
export async function retrieveDocuments(
  query: string,
  k: number = 5,
  namespaces: string[] = [""]
): Promise<Document[]> {
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
    dimensions: 1024
  });

  // Retrieve from each namespace with scores
  const allResults = await Promise.all(
    namespaces.map(async (namespace) => {
      const vectorStore = await getVectorStore(embeddings, namespace);
      return vectorStore.similaritySearchWithScore(query, k);
    })
  );

  // Flatten and combine all results with scores
  const combinedWithScores = allResults.flat();

  // Sort by score (lower score = more similar in cosine distance)
  combinedWithScores.sort((a, b) => a[1] - b[1]);

  // Return top k documents
  return combinedWithScores.slice(0, k).map(([doc]) => doc);
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
      const { filename, episodeNumber, source, title, contentType, year } = doc.metadata;

      // Format header based on content type
      let header: string;
      if (contentType === "blog" && title) {
        header = `[Blog Post: ${title}${year ? ` (${year})` : ""}]`;
      } else if (episodeNumber) {
        header = `[Podcast Episode ${episodeNumber} - ${filename}]`;
      } else {
        header = `[${filename || source || "Unknown source"}]`;
      }

      return `Context ${index + 1}:\n${header}\n${doc.pageContent}\n`;
    })
    .join("\n---\n\n");

  return formattedChunks;
}