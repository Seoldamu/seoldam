
export const aiService = {
  askChatbot: (prompt: string, seriesPath: string | null): Promise<string> => {
    return window.api.ai.askChatbot(prompt, seriesPath)
  }
}
