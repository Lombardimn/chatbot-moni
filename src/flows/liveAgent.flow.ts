import { API_BLACKLIST } from "@/config";
import { addKeyword, EVENTS } from "@builderbot/bot"

export const liveAgentFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(`👋 Hola soy Moni tu asistente virtual 🤖.\nGracias por contactarnos. \n📝 Hemos recibido tu solicitud y en breve serás atendido por nuestro personal.⏳⏳⏳\n\n¡Estaré por aquí para ayudarte en lo que necesites!
`,
    {
      delay: 800,
    },
    async (ctx, ctxFn) => {
      const userName = ctx.name
      const userNumber = ctx.from

      // Agregar el usuario a la Blacklist
      await fetch( API_BLACKLIST, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            number: userNumber,
            name: userName,
            intent: 'add',
            duration: 2 // duración en minutos
        })        
      })
    }
  )