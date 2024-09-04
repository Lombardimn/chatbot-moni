import { addKeyword, EVENTS } from "@builderbot/bot"
import { supportFlow, liveAgentFlow } from "@/flows"
export const feedbackFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(
    `🙁 Disculpa, pero no entiendo tu consulta. Por favor, intenta de nuevo. 😊`,
    { delay: 1000 }
  )
  .addAnswer(
    `Dime cuál de estas opciones pueden ayudarte:
    
    1️⃣ ¿Quieres hacer un pedido?
    2️⃣ ¿Necesitas gestionar un pedido ya realizado?
    3️⃣ ¿Quieres hacer una consulta?
    4️⃣ ¿Necesitas comunicarte con un asistente personalizado?
    `,
    {
      delay: 800,
      capture: true
    },
    async (ctx, { flowDynamic, gotoFlow }) => {
      if (ctx.body.includes('1')) {
        return await flowDynamic('flujo de registro de pedidos')
      } else if (ctx.body.includes('2')) {
        return await flowDynamic('flujo de gestion de pedidos')
      } else if (ctx.body.includes('3')) {
        return gotoFlow(supportFlow)
      } else if (ctx.body.includes('4')) {
        return gotoFlow(liveAgentFlow)
      } else {
        return gotoFlow(feedbackFlow)
      }
    }
  )
