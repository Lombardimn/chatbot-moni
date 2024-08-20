import { addKeyword, EVENTS } from "@builderbot/bot"
import { helperIA } from "@/helpers"
import * as fs from 'fs'
import { PromptData } from "@/interfaces"

export const supportFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(`¿Cual es tu consulta? \nEstoy aquí para ayudarte 🦾🤖`,
    {
      delay: 800,
    }
  )
  .addAnswer('',
    {
      capture: true,
      delay: 800,
    }, 
    async (ctx, ctxFn) => {
      // Leer el archivo JSON
      const data = fs.readFileSync('./src/resources/prompts.json', 'utf8')
      const values: PromptData = JSON.parse(data)

      // Construir el prompt para la IA
      const prompt = `
        ${values.promptIA}
        Menú del Día: 
        ${Object.values(values.menuDay).join(', ')}

        Menús disponibles:
        ${Object.values(values.menus).map(menu => `${menu.name} - ${menu.simbolMoney}${menu.price} ${menu.typeOfMoney}`).join('\n')}

        Preguntas frecuentes:
        ${Object.values(values.faq).join('\n')}
      `
      const context = ctx.body; 
      const response = await helperIA(prompt, context)
    
      await ctxFn.flowDynamic(response)
    }
  )
  .addAnswer(`
    ¿Quieres saber algo más 🤔?
    1️⃣ SI.
    2️⃣ NO.
    3️⃣ Realizar pedido.
    4️⃣ Hablar con un asistente.
    `,
    {
      delay: 800,
      capture: true
    },
    async (ctx, ctxFn) => {
      if (ctx.body.includes('1')) {
        return await ctxFn.gotoFlow(supportFlow)
      } else if (ctx.body.includes('2')) {
        return await ctxFn.flowDynamic('Hasta pronto 👋')
      } else if (ctx.body.includes('3')) {
        return await ctxFn.flowDynamic('flujo de registro de pedidos')
      } else if (ctx.body.includes('4')) {
        return await ctxFn.flowDynamic('flujo de asistencia personalizada')
      } else {
        return await ctxFn.gotoFlow(supportFlow)
      }
    }
  )