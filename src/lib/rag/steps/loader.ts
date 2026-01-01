import { Document } from "@langchain/core/documents";
import * as fs from "fs/promises";
import * as path from "path";
import mammoth from "mammoth";

/**
 * Loads .docx files from a folder and converts them to LangChain Documents
 */
export async function loadDocuments(folderPath: string): Promise<Document[]> {
  const files = await fs.readdir(folderPath);
  const docxFiles = files.filter((file) => file.endsWith(".docx"));

  const documents = await Promise.all(
    docxFiles.map(async (filename) => {
      const filePath = path.join(folderPath, filename);
      const buffer = await fs.readFile(filePath);

      // Convert .docx to plain text using mammoth
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value;

      // Extract episode number from filename if present (e.g., "Ep. 100_")
      const episodeMatch = filename.match(/Ep\.\s*(\d+)/i);
      const episodeNumber = episodeMatch ? parseInt(episodeMatch[1]) : null;

      return new Document({
        pageContent: text,
        metadata: {
          source: filePath,
          filename,
          episodeNumber,
        },
      });
    })
  );

  return documents;
}