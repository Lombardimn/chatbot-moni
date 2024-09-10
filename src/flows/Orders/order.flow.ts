import { API_ORDER } from '@/config'
import { clientRegistry } from '@/controllers'
import { EVENTS, addKeyword } from '@builderbot/bot'

export const orderFlow = addKeyword(EVENTS.ACTION)
  .addAnswer('',
    { delay: 800 },
    async (ctx, {flowDynamic}) => {
      await flowDynamic('Genial, vamos a proceder a realizar tu pedido. 😊')
    }
  )
  .addAction(
    { delay: 1000, capture: true },
    async (ctx, { flowDynamic, state }) => {
      const number = ctx.from
      const { name, address, hourDelivery } = await clientRegistry.getClient(number)

      await state.update({ name, address, hourDelivery })

      await flowDynamic(`Hola ${state.get('name')}! Dime, ¿Cuál es tu opción de pedido?`)
    }
  )
  .addAction(
    { delay: 1000, capture: true },
    async (ctx, { flowDynamic, state }) => {
      const menu = 'menu'
      const price = 'price'

      await flowDynamic([
        'Me confirmas si es correcto:',
        `Solicitas la opción: ${ctx.body.trim()}`,
        `${menu} - ${price}`,
        `Enviar a: ${state.get('address')}`,
        `En el horario de las: ${state.get('hourDelivery')}`
      ])
    }
  )
  .addAnswer(
    [
			'1️⃣ Es correcto.',
			'2️⃣ NO, es incorrecto.'
		],
    { delay: 800, capture: true },
    async (ctx, {flowDynamic, gotoFlow, state}) => {
      if(ctx.body.includes('1')) {
        await fetch( API_ORDER, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            intent: 'add',
            number: ctx.from,
            menu: 'menu',
            price: 'price',
            address: state.get('address'),
            hourDelivery: state.get('hourDelivery'),
            createAt: Date.now()
          })
        })
        return await flowDynamic('Listo 😊, Muchas gracias!. Tu pedido fue registrado con exito...🚀')
      }

      if(ctx.body.includes('2')) {
        await flowDynamic('Lo siento 😕, hubo un problema. Vamos a intentarlo una vez más')
        return gotoFlow(orderFlow)
      }
    }
  )