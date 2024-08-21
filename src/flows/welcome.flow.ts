import { addKeyword, EVENTS } from "@builderbot/bot";
import { supportFlow } from "./support.flow";
import { liveAgentFlow } from "./liveAgent.flow";

export const welcomeFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(`🙌 Hola soy Moni tu asistente virtual 🤖`,
    { delay: 800 },
    async (ctx, ctxFn) => {
      const name = ctx.name.split(' ')[0]
      await ctxFn.flowDynamic(`Dime ${name} ¿En qué puedo ayudarte?`)
    }
  )
  .addAnswer('',
    { delay: 800, capture: true },
    async (ctx, ctxFn) => {
      if (ctx.body.includes('consulta')) {
        ctxFn.gotoFlow(supportFlow)
      }

      if (ctx.body.includes('menu')) {
        return await ctxFn.flowDynamic('flujo de opcion de menus')
      }

      if (ctx.body.includes('pedir')) {
        return await ctxFn.flowDynamic('flujo de registro de pedidos')
      }

      if (ctx.body.includes('cancelar')) {
        return await ctxFn.flowDynamic('flujo de cancerlar pedido')
      }

      if (ctx.body.includes('persona')) {
        return await ctxFn.gotoFlow(liveAgentFlow)
      }
    }
  )
