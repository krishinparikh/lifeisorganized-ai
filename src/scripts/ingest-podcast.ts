import { ingestPodcastScripts } from "../lib/rag/ingest";

async function main() {
  console.log("Starting RAG ingestion pipeline...\n");

  const result = await ingestPodcastScripts({
    folderPath: "data/podcast_scripts",
    chunkSize: 2000,
    chunkOverlap: 400,
    namespace: "podcast-scripts",
  });

  if (result.success) {
    console.log("\n Ingestion completed successfully!");
    console.log(`=� Documents loaded: ${result.documentsLoaded}`);
    console.log(`=� Chunks created: ${result.chunksCreated}`);
  } else {
    console.error("\nL Ingestion failed:", result.error);
    process.exit(1);
  }
}

main();