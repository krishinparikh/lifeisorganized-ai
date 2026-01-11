import { Document } from "@langchain/core/documents";
import * as fs from "fs/promises";
import * as path from "path";
import mammoth from "mammoth";
import { DocumentMetadata } from "../../types";

/**
 * Loads .docx podcast script files from a folder and converts them to LangChain Documents
 */
export async function loadPodcastScripts(folderPath: string): Promise<Document[]> {
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
      const episodeNumber = episodeMatch ? parseInt(episodeMatch[1]) : undefined;

      const metadata: DocumentMetadata = {
        source: filePath,
        filename,
        contentType: "podcast",
        episodeNumber,
      };

      return new Document({
        pageContent: text,
        metadata,
      });
    })
  );

  return documents;
}

/**
 * Loads markdown blog posts and splits them into individual posts
 * Each blog post is separated by a heading (# Title)
 */
export async function loadBlogPosts(folderPath: string): Promise<Document[]> {
  const files = await fs.readdir(folderPath);
  const mdFiles = files.filter((file) => file.endsWith(".md"));

  const allDocuments: Document[] = [];

  for (const filename of mdFiles) {
    const filePath = path.join(folderPath, filename);
    const content = await fs.readFile(filePath, "utf-8");

    // Extract year from filename (e.g., "2023.md" -> "2023")
    const yearMatch = filename.match(/(\d{4})/);
    const year = yearMatch ? yearMatch[1] : undefined;

    // Split content by top-level headings (# Title)
    const posts = content.split(/^# /m).filter((post) => post.trim());

    for (const post of posts) {
      const lines = post.split("\n");
      const titleLine = lines[0].trim();

      // Extract date if present in title (e.g., "12.12.24" or "11.22.24")
      const dateMatch = titleLine.match(/(\d{1,2}\.\d{1,2}\.\d{2,4})/);
      const date = dateMatch ? dateMatch[1] : undefined;

      // Clean title (remove date if present)
      const title = titleLine.replace(/\d{1,2}\.\d{1,2}\.\d{2,4}/, "").trim();

      // Get the full content (rejoin the lines)
      const pageContent = post.trim();

      const metadata: DocumentMetadata = {
        source: filePath,
        filename,
        contentType: "blog",
        title,
        date,
        year,
      };

      allDocuments.push(
        new Document({
          pageContent,
          metadata,
        })
      );
    }
  }

  return allDocuments;
}