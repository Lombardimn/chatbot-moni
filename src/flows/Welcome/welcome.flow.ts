import { addKeyword, EVENTS } from "@builderbot/bot"
import { supportFlow, liveAgentFlow } from "@/flows"

export const welcomeFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(`🙌 Hola soy Moni tu asistente virtual 🤖`,
    { delay: 800 },
    async (ctx, { flowDynamic }) => {
      const name = ctx.name.split(' ')[0]
      await flowDynamic(`Dime ${name} ¿En qué puedo ayudarte?`)
    }
  )
  .addAnswer('',
    { delay: 800, capture: true },
    async (ctx, {gotoFlow, flowDynamic}) => {
      if (ctx.body.includes('consulta')) {
        return gotoFlow(supportFlow)
      }

      if (ctx.body.includes('menu')) {
        return await flowDynamic('flujo de opcion de menus')
      }

      if (ctx.body.includes('pedir')) {
        return await flowDynamic('flujo de registro de pedidos')
      }

      if (ctx.body.includes('cancelar')) {
        return await flowDynamic('flujo de cancerlar pedido')
      }

      if (ctx.body.includes('persona')) {
        return gotoFlow(liveAgentFlow)
      }
    }
  )
