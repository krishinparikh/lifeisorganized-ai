# Digital Mind: Life is Organized

AI chatbot that delivers on-demand advice in the authentic voice and expertise of Mridu Parikh — a productivity consultant and owner of <a href="https://lifeisorganized.com/" target="_blank" rel="noopener noreferrer">Life is Organized</a>.

## Getting Started

### Prerequisites

- Node.js 20+
- OpenAI API key
- Pinecone API key and index

### Installation

1. Clone the repository:
```bash
git clone https://github.com/krishinparikh/lifeisorganized-ai
cd lifeisorganized-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=your_pinecone_index_name
```

4. Run the ingest-docs script
```bash
npm run ingest
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Relevant Scripts

- `npm run ingest:podcast` - Ingest podcast transcripts from `data/podcast/` into Pinecone
- `npm run ingest:blog` - Ingest blog posts from `data/blog/` into Pinecone
- `npm run clear:podcast` - Clear all podcast vectors from Pinecone
- `npm run clear:blog` - Clear all blog vectors from Pinecone

## Project Structure

```
lifeisorganized-ai/
├── src/
│   ├── app/
│   │   ├── (home)/
│   │   │   ├── components/
│   │   │   │   ├── Chat.tsx          # Main chat component
│   │   │   │   ├── ChatMessage.tsx   # Individual message display
│   │   │   │   ├── ChatInput.tsx     # User input component
│   │   │   │   └── EmailDialog.tsx   # Email composition dialog
│   │   │   └── page.tsx              # Home page with chat interface
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts          # API endpoint for chat streaming
│   │   └── layout.tsx                # Root layout
│   ├── components/
│   │   ├── ui/                       # Reusable UI components (shadcn/ui)
│   │   └── ai-elements/              # AI-powered UI components
│   ├── lib/
│   │   ├── chat.ts                   # Chat logic and RAG integration
│   │   ├── prompts.ts                # System and user prompts
│   │   ├── types.ts                  # TypeScript type definitions
│   │   ├── utils.ts                  # Utility functions
│   │   ├── db/
│   │   │   └── actions.ts            # Database operations
│   │   ├── gmail/
│   │   │   ├── actions.ts            # Gmail API actions
│   │   │   └── client.ts             # Gmail client setup
│   │   └── rag/
│   │       ├── ingest.ts             # Document ingestion pipeline
│   │       └── steps/
│   │           ├── loader.ts         # Document loading
│   │           ├── chunker.ts        # Text chunking
│   │           ├── embedder.ts       # Text embedding
│   │           ├── vector-store.ts   # Pinecone storage
│   │           └── retriever.ts      # Document retrieval
│   └── scripts/
│       ├── ingest-podcast.ts         # Ingest podcast transcripts
│       ├── ingest-blog.ts            # Ingest blog posts
│       ├── clear-podcast.ts          # Clear podcast vectors
│       ├── clear-blog.ts             # Clear blog vectors
│       ├── get-gmail-refresh-token.ts # Get Gmail OAuth token
│       └── test-gmail.ts             # Test Gmail integration
├── data/
│   ├── blog_posts/                   # Blog posts for ingestion
│   └── podcast_scripts/              # Podcast transcripts for ingestion
└── public/                           # Static assets
```

## How it Works

### RAG Pipeline

The application uses a Retrieval-Augmented Generation (RAG) pipeline to provide contextual, informed responses:

1. **Document Ingestion** ([src/lib/rag/ingest.ts](src/lib/rag/ingest.ts))
   - Loads documents from `data/podcast/` (podcast transcripts) and `data/blog/` (blog posts)
   - Supports .txt and .docx file formats
   - Splits documents into chunks (1000 characters, 200 overlap)
   - Generates embeddings using OpenAI's `text-embedding-3-small`
   - Stores chunks and embeddings in Pinecone vector database with separate namespaces

2. **Query Processing** ([src/lib/chat.ts](src/lib/chat.ts))
   - User sends a message through the chat interface
   - System retrieves relevant document chunks from Pinecone based on semantic similarity
   - Augments the user's query with retrieved context
   - Sends enhanced prompt to GPT-4o-mini

3. **Response Generation**
   - LangChain streams responses from OpenAI
   - UI displays responses in real-time using the Vercel AI SDK
   - Conversation history is maintained for context

4. **Activity Tracking & Notifications**
   - Chat conversations are stored in Notion database for record-keeping
   - Email notifications are sent to the consultant via Gmail API when new activity occurs
   - Enables the consultant to monitor and review user interactions

### Tech Stack

- **Web Application**: Next.js 16, TypeScript, React 19, Tailwind CSS 4, shadcn/ui
- **AI/LLM**: LangChain, LangGraph, Pinecone (vector store), OpenAI (LLM and embedding), Vercel AI SDK (streaming)
- **Integrations**: Gmail API (googleapis), Notion API (@notionhq/client)