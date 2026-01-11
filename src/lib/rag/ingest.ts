import "dotenv/config";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Embeddings } from "@langchain/core/embeddings";
import { loadPodcastScripts, loadBlogPosts } from "./steps/loader";
import { chunkDocuments } from "./steps/chunker";
import { storeDocuments } from "./steps/vector-store";

export interface IngestOptions {
  folderPath: string;
  chunkSize: number;
  chunkOverlap: number;
  embeddings?: Embeddings;
  namespace?: string;
}

/**
 * Orchestrates the full RAG ingestion pipeline:
 * 1. Load documents from folder
 * 2. Chunk documents
 * 3. Embed chunks
 * 4. Store in Pinecone
 */
export async function ingestPodcastScripts(
  options: IngestOptions
): Promise<{
  success: boolean;
  documentsLoaded: number;
  chunksCreated: number;
  error?: string;
}> {
  try {
    const {
      folderPath,
      chunkSize,
      chunkOverlap,
      embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
        dimensions: 1024
      }),
      namespace,
    } = options;

    console.log("Loading podcast scripts from:", folderPath);
    const documents = await loadPodcastScripts(folderPath);
    console.log(`Loaded ${documents.length} podcast scripts`);

    console.log("Chunking documents...");
    const chunks = await chunkDocuments(documents, chunkSize, chunkOverlap);
    console.log(`Created ${chunks.length} chunks`);

    console.log("Storing documents in Pinecone...");
    await storeDocuments(chunks, embeddings, namespace);
    console.log("Documents stored successfully!");

    return {
      success: true,
      documentsLoaded: documents.length,
      chunksCreated: chunks.length,
    };
  } catch (error) {
    console.error("Error during ingestion:", error);
    return {
      success: false,
      documentsLoaded: 0,
      chunksCreated: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Orchestrates the RAG ingestion pipeline for blog posts:
 * 1. Load markdown blog posts and split into individual posts
 * 2. Chunk documents
 * 3. Embed chunks
 * 4. Store in Pinecone
 */
export async function ingestBlogPosts(
  options: IngestOptions
): Promise<{
  success: boolean;
  documentsLoaded: number;
  chunksCreated: number;
  error?: string;
}> {
  try {
    const {
      folderPath,
      chunkSize,
      chunkOverlap,
      embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
        dimensions: 1024
      }),
      namespace,
    } = options;

    console.log("Loading blog posts from:", folderPath);
    const documents = await loadBlogPosts(folderPath);
    console.log(`Loaded ${documents.length} blog posts`);

    console.log("Chunking documents...");
    const chunks = await chunkDocuments(documents, chunkSize, chunkOverlap);
    console.log(`Created ${chunks.length} chunks`);

    console.log("Storing documents in Pinecone...");
    await storeDocuments(chunks, embeddings, namespace);
    console.log("Documents stored successfully!");

    return {
      success: true,
      documentsLoaded: documents.length,
      chunksCreated: chunks.length,
    };
  } catch (error) {
    console.error("Error during ingestion:", error);
    return {
      success: false,
      documentsLoaded: 0,
      chunksCreated: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
