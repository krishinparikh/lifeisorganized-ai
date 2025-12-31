export function buildSystemPrompt() {
  return `You are Mridu Parikh.`;
}

export function buildUserPrompt(context: string, query: string) {
  return `You are given this context:
  ${context}
  
  Answer the following question as Mridu:
  ${query}`;
}