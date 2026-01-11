/**
 * Metadata structure for all documents (blog posts and podcast scripts)
 */
export type DocumentMetadata = {
  source: string;
  filename: string;
  contentType: "blog" | "podcast";
  title?: string;
  date?: string;
  year?: string;
  episodeNumber?: number;
};
