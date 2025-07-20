import { existsSync, readFileSync, readdirSync, statSync } from 'fs'
import { join, relative } from 'path'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { ipcMain } from 'electron'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' })

function readDirectoryRecursive(dirPath: string): any[] {
  const items = readdirSync(dirPath)
  return items.map((name) => {
    const fullPath = join(dirPath, name)
    const stats = statSync(fullPath)
    const isDirectory = stats.isDirectory()
    const isFile = stats.isFile()

    const node: any = {
      id: fullPath,
      name,
      type: isDirectory ? 'folder' : 'file',
      path: fullPath,
      children: isDirectory ? readDirectoryRecursive(fullPath) : undefined
    }

    if (isFile) {
      try {
        node.content = readFileSync(fullPath, 'utf-8')
      } catch (e) {
        node.content = ''
      }
    }

    return node
  })
}

const handleAskChatbot = async (_, prompt: string, seriesPath: string | null) => {
  try {
    let fileContext = ''
    if (seriesPath) {
      const rootPath = join(seriesPath, 'root')
      if (existsSync(rootPath)) {
        const fileTree = readDirectoryRecursive(rootPath)

        const stringifyTree = (nodes: any[], prefix = '') => {
          let str = ''
          for (const node of nodes) {
            const relativePath = relative(rootPath, node.path)
            str += `${prefix}- ${node.name} (${node.type})\n`
            if (node.type === 'file') {
              str += `  (path: ${relativePath})\n`
              str += `  --- content ---\n${node.content}\n  ---------------\n`
            }
            if (node.children) {
              str += stringifyTree(node.children, prefix + '  ')
            }
          }
          return str
        }
        fileContext = `
You have access to the following files in the user's current series.
File structure and content:
---
${stringifyTree(fileTree)}
---
`
      }
    }

    const systemPrompt = `
    You are an expert writing assistant integrated into an application called 'Seoldam'.
    You are called "Seoldamu", a professional writing assistant designed to help users with creative writing projects.
    
    ${fileContext}
    
    You have access to the following files in the user's current series.
    These files contain important context for the user's work. You must treat them as your prior knowledge when helping the user.
    Always consider their content before giving advice, suggestions, or generating any writing.
    
    If the user refers to or gives instructions about a specific file,
    you must first read the content of the file, understand the context, and then respond according to the user's instruction.
    
    Stay focused on being helpful, clear, and knowledgeable.
    Always present your answers in a readable, well-structured, and visually clear manner.
    Use lists, headings, and formatting where appropriate to make your answers easy to scan and understand.
    Guide the user toward better writing and creative clarity through informed and supportive answers.

    You must always answer in Korean, regardless of the language used in the prompt.
    `

    const finalPrompt = `${systemPrompt}\n\nUser's request: "${prompt}"`

    const result = await model.generateContent(finalPrompt)
    const response = await result.response
    const text = response.text()

    return text
  } catch (error) {
    console.error('Error in ask-chatbot handler:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return `API 호출 중 오류가 발생했습니다: ${errorMessage}`
  }
}

export function registerAiHandlers(): void {
  ipcMain.handle('ask-chatbot', handleAskChatbot)
}
