import { API_REGISTER } from '@/config'
import { MemoryDB as Database, addKeyword, utils } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'

export const registerFlow = addKeyword<Provider, Database>(utils.setEvent('REGISTER_FLOW'))
	.addAnswer(`🙌 ¡Gracias por confiar en nosotros! 😊\nA continuación, te haré unas preguntas para finalizar tu primer pedido. 🛍️\nAdemás, así en tu próximo pedido serás atendido de manera rápida y sencilla. 🚀`,
		{ delay: 800 },
		async (ctx, ctxFn) => {
			const name = ctx.name.split(' ')[0]
			await ctxFn.flowDynamic(
				`Dime ${name} ¿Este es tu nombre?\n	1️⃣ SI.\n	2️⃣ NO.`
			)
		}
	)
	.addAnswer('',
    { delay: 800, capture: true },
    async (ctx, {state, flowDynamic}) => {
      if(ctx.body.includes('1')) {
				await state.update({ name: ctx.name })
			}

			if(ctx.body.includes('2')) {
				return await flowDynamic('No hay problema! 😀')

			}
		}
  )
	.addAnswer(`¿Dime, Cuál es tu nombre?`,
		{ delay: 1000, capture: true },
		async (ctx, { state }) => {
			await state.update({ name: ctx.body })
		}
	)
	.addAnswer('¿Cuál es tu dirección?',
		{ capture: true },
		async (ctx, { state }) => {
			await state.update({ address: ctx.body })
		}
	)
	.addAnswer('¿Cuál es el horario de reparto que prefieres?\n*_Solo ingresa el número_*',
		{ delay: 1000, capture: true },
		async (ctx, { state }) => {
			await state.update({ hourDelivery: ctx.body })
		}
	)
	.addAnswer('', 
		{ delay: 800 }, 
		async (ctx, { flowDynamic, state }) => {
			return await flowDynamic(
				`Perfecto 😊, Muchas gracias ${state.get('name')} por registrarte\nPara terminar vamos a corroborar tu información:\n\n*Direccion:* ${state.get('address')}\n*Horario de reparto:* ${state.get('hourDelivery')}hs`
			)
		}
	)
	.addAnswer('1️⃣ Es correcto.\n2️⃣ NO, es incorrecto.',
		{ delay: 800, capture: true },
		async (ctx, {flowDynamic, gotoFlow, state}) => {
			if(ctx.body.includes('1')) {
				// Registrar el cliente en la base de datos
				await fetch( API_REGISTER, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						number: ctx.from,
						name: state.get('name'),
						address: state.get('address'),
						hourDelivery: state.get('hourDelivery')
					})
				})

				return await flowDynamic('Perfecto 😊, Muchas gracias!. Tu pedido fue registrado con exito!')
			}

			if(ctx.body.includes('2')) {
				await flowDynamic('Lo siento 😕, no hay problema. ¿Quieres intentarlo de nuevo?')
				return gotoFlow(registerFlow)
			}
		}
	)
