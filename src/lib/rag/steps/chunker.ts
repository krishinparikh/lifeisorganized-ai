import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

/**
 * Chunks documents into smaller pieces using RecursiveCharacterTextSplitter
 */
export async function chunkDocuments(
  documents: Document[],
  chunkSize: number = 1000,
  chunkOverlap: number = 200
): Promise<Document[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
  });

  const chunkedDocuments = await splitter.splitDocuments(documents);

  return chunkedDocuments;
}