import { create } from 'zustand'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

type ChatState = {
  messages: Message[]
  addMessage: (role: 'user' | 'assistant', content: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (role, content) =>
    set((state) => ({
      messages: [...state.messages, { id: `msg-${Date.now()}`, role, content }]
    }))
}))
