import { EVENTS, addKeyword } from '@builderbot/bot'
import { API_REGISTER } from '@/config'

export const registerFlow = addKeyword(EVENTS.ACTION)
	.addAnswer(
		[
			'🙌 ¡Gracias por confiar en nosotros! 😊',
			'A continuación, te haré unas preguntas para finalizar tu primer pedido. 🛍️',
			'Así en el próximo serás atendido de manera rápida y sencilla. 🚀'
		],
		{ delay: 800 },
		async (ctx, {flowDynamic}) => {
			await flowDynamic('¿Me dices tu nombre o como quieras ser llamado?')
		}
	)
	.addAction(
    { delay: 800, capture: true },
    async (ctx, {flowDynamic, state}) => {
			const customer = ctx.body.trim()

			await state.update({ name: customer })

			await flowDynamic('Perfecto 😀, Dime ¿Cuál es tu dirección?')
		}
	)
	.addAction(
		{ delay: 800, capture: true },
		async (ctx, {flowDynamic, gotoFlow, state}) => {
			const address = ctx.body.trim()

			await state.update({ address: address })

			await flowDynamic('La última, Dime ¿Que horario prefieres para el reparto del pedido?')
		}
	)
	.addAction(
		{ delay: 800, capture: true },
		async (ctx, {flowDynamic, gotoFlow, state}) => {
			let hourDelivery = ctx.body.trim()

			hourDelivery = `${hourDelivery.padStart(2, '0')}:00hs`

			await state.update({ hourDelivery: hourDelivery })

			await flowDynamic('Recompilando la información. ⏳⏳⏳')
		}
	)
	.addAction(
		{ delay: 800 },
		async (_, { flowDynamic, state }) => {
			await flowDynamic([
				`Perfecto 😊, Muchas gracias ${state.get('name')} por registrarte`,
				`Para terminar vamos a corroborar tu información:\n*Nombre:* ${state.get('name')}\n*Direccion:* ${state.get('address')}\n*Horario de reparto:* ${state.get('hourDelivery')}`
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
				// Registrar el cliente en la base de datos
				await fetch( API_REGISTER, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						intent: 'add',
						number: ctx.from,
						name: state.get('name'),
						address: state.get('address'),
						hourDelivery: state.get('hourDelivery')
					})
				})
				return await flowDynamic('Listo 😊, Muchas gracias!. La proxima sera mucho mas sencillo pedir...🚀')
			}

			if(ctx.body.includes('2')) {
				await flowDynamic('Lo siento 😕, hubo un problema. Vamos a intentarlo una vez más')
				return gotoFlow(registerFlow)
			}
		}
	)
