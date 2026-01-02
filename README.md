# AI Chatbot Persona: Life is Organized

An intelligent AI chatbot web application that emulates the authentic voice and expertise of Mridu Parikh — a productivity consultant and owner of [Life is Organized](https://lifeisorganized.com/).

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

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
lifeisorganized-ai/
├── src/
│   ├── app/
│   │   ├── (home)/
│   │   │   ├── components/
│   │   │   │   ├── Chat.tsx          # Main chat component
│   │   │   │   ├── ChatMessage.tsx   # Individual message display
│   │   │   │   └── ChatInput.tsx     # User input component
│   │   │   └── page.tsx              # Home page with chat interface
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts          # API endpoint for chat streaming
│   │   └── layout.tsx                # Root layout
│   ├── components/
│   │   └── ui/                       # Reusable UI components
│   ├── lib/
│   │   ├── chat.ts                   # Chat logic and RAG integration
│   │   ├── prompts.ts                # System and user prompts
│   │   ├── types.ts                  # TypeScript type definitions
│   │   ├── utils.ts                  # Utility functions
│   │   └── rag/
│   │       ├── ingest.ts             # Document ingestion pipeline
│   │       └── steps/
│   │           ├── loader.ts         # Document loading
│   │           ├── chunker.ts        # Text chunking
│   │           ├── embedder.ts       # Text embedding
│   │           ├── vector-store.ts   # Pinecone storage
│   │           └── retriever.ts      # Document retrieval
│   └── scripts/
│       └── ingest-docs.ts            # CLI script for ingesting documents
└── podcast_scripts/                   # Default folder for documents to ingest
```

## How it Works

### RAG Pipeline

The application uses a Retrieval-Augmented Generation (RAG) pipeline to provide contextual, informed responses:

1. **Document Ingestion** ([src/lib/rag/ingest.ts](src/lib/rag/ingest.ts))
   - Loads documents from the `podcast_scripts` folder (supports .txt, .docx)
   - Splits documents into chunks (1000 characters, 200 overlap)
   - Generates embeddings using OpenAI's `text-embedding-3-small`
   - Stores chunks and embeddings in Pinecone vector database

2. **Query Processing** ([src/lib/chat.ts](src/lib/chat.ts))
   - User sends a message through the chat interface
   - System retrieves relevant document chunks from Pinecone based on semantic similarity
   - Augments the user's query with retrieved context
   - Sends enhanced prompt to GPT-4o-mini

3. **Response Generation**
   - LangChain streams responses from OpenAI
   - UI displays responses in real-time using the Vercel AI SDK
   - Conversation history is maintained for context

### Tech Stack

- **Web Application**: Next.js 16, TypeScript, React 19, Tailwind CSS, shadcn/ui
- **AI/LLM**: LangChain, Pinecone (vector store), OpenAI (LLM and embedding), Vercel AI SDK (streaming)