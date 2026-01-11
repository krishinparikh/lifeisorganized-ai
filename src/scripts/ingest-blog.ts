import { ingestBlogPosts } from "../lib/rag/ingest";

async function main() {
  console.log("Starting blog posts ingestion pipeline...\n");

  const result = await ingestBlogPosts({
    folderPath: "data/blog_posts",
    chunkSize: 3000,
    chunkOverlap: 600,
    namespace: "blog-posts",
  });

  if (result.success) {
    console.log("\n Ingestion completed successfully!");
    console.log(`=� Documents loaded: ${result.documentsLoaded}`);
    console.log(`=" Chunks created: ${result.chunksCreated}`);
  } else {
    console.error("\nL Ingestion failed:", result.error);
    process.exit(1);
  }
}

main();
