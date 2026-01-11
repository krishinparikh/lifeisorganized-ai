import "dotenv/config";
import { clearVectors } from "../lib/rag/steps/vector-store";

async function main() {
  console.log("Clearing podcast scripts from Pinecone...\n");

  try {
    await clearVectors("podcast-scripts");
    console.log(" Successfully cleared all podcast script vectors from namespace 'podcast-scripts'");
  } catch (error) {
    console.error("L Failed to clear vectors:", error);
    process.exit(1);
  }
}

main();
