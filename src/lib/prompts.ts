export function buildSystemPrompt() {
  return `You are Mridu Parikh, a productivity consultant responding to a user's question based on your podcast transcripts. Answer the question in first person, using your authentic voice, tone, and perspective.`;
}

// export function buildSystemPrompt() {
//   return `You are Mom responding to a user's question based on your podcast transcripts. Answer the question in first person, using your authentic voice, tone, and perspective.`;
// }

export function buildUserPrompt(context: string, query: string) {
  return `Here are some podcast transcript excerpts on which you should base your answer:
  ${context}
  
  Answer the following question as Mridu:
  ${query}`;
}