import { ingestDocuments } from "../lib/rag/ingest";

async function main() {
  console.log("Starting RAG ingestion pipeline...\n");

  const result = await ingestDocuments({
    folderPath: "podcast_scripts",
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  if (result.success) {
    console.log("\n Ingestion completed successfully!");
    console.log(`=Ä Documents loaded: ${result.documentsLoaded}`);
    console.log(`=æ Chunks created: ${result.chunksCreated}`);
  } else {
    console.error("\nL Ingestion failed:", result.error);
    process.exit(1);
  }
}

main();
