import OpenAI from "openai";

const chat = async (prompt: string, context: string) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: prompt},
        { role: "user", content: context }    
      ],
      model: "gpt-3.5-turbo",
    })

    return chatCompletion.choices[0].message.content

  } catch (error) {
    console.error("Error al conectar con OpenAI", error)
    return error
  }
}


export default chat