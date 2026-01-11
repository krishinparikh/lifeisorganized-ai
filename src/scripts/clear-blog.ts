import "dotenv/config";
import { clearVectors } from "../lib/rag/steps/vector-store";

async function main() {
  console.log("Clearing blog posts from Pinecone...\n");

  try {
    await clearVectors("blog-posts");
    console.log(" Successfully cleared all blog post vectors from namespace 'blog-posts'");
  } catch (error) {
    console.error("L Failed to clear vectors:", error);
    process.exit(1);
  }
}

main();
