import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'

dotenv.config()

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
)

export const helperIA = async (prompt: string, context: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const formatPrompt = `Sos un asistente virtual. Al final te voy a dar un input que envio un usuario. Solo responde la consulta o haz la acción solicitada.
  \n\n` + prompt + `\n\nEl input del usuario es el siguiente: ` + context

  const result = await model.generateContent(formatPrompt)
  const response = result.response
  const answer = response.text()

  return answer
}