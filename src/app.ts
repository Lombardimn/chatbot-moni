import { createBot, createProvider, createFlow, addKeyword, utils, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { pillValidator, readFile } from '@/services'
import { feedbackFlow, supportFlow, welcomeFlow } from '@/flows'

const PORT = process.env.PORT ?? 3008

// Menu principal del modelo de negocio.
const mainFlow = addKeyword(EVENTS.WELCOME)
	.addAction(async (ctx, ctxFn) => {
		const bodyText: string = ctx.body.toLowerCase()
		
		// Pildoras de llamadas.
		const greetings = readFile('./src/resources/pill.json', 'greetings')
		const support = readFile('./src/resources/pill.json', 'support')

		//verificadores
		const flagGreeting = pillValidator(greetings, bodyText)
		const flagSupport = pillValidator(support, bodyText)

		// Respuestas.
		if (flagGreeting && !flagSupport) {
			return ctxFn.gotoFlow(welcomeFlow)
		}

		if (!flagGreeting && flagSupport) {
			return ctxFn.gotoFlow(supportFlow)
		}

		if (flagGreeting && flagSupport) {
			return ctxFn.gotoFlow(supportFlow)
		}
		
		return await ctxFn.gotoFlow(feedbackFlow)
	})

const registerFlow = addKeyword<Provider, Database>(utils.setEvent('REGISTER_FLOW'))
	.addAnswer(`What is your name?`, { capture: true }, async (ctx, { state }) => {
		await state.update({ name: ctx.body })
	})
	.addAnswer('What is your age?', { capture: true }, async (ctx, { state }) => {
		await state.update({ age: ctx.body })
	})
	.addAction(async (_, { flowDynamic, state }) => {
		await flowDynamic(`${state.get('name')}, thanks for your information!: Your age: ${state.get('age')}`)
	})

const main = async () => {
	const adapterFlow = createFlow([mainFlow, welcomeFlow, supportFlow, feedbackFlow, registerFlow])

	const adapterProvider = createProvider(Provider)
	const adapterDB = new Database()

	const { handleCtx, httpServer } = await createBot({
		flow: adapterFlow,
		provider: adapterProvider,
		database: adapterDB,
	})

	adapterProvider.server.post(
		'/v1/messages',
		handleCtx(async (bot, req, res) => {
			const { number, message, urlMedia } = req.body
			await bot.sendMessage(number, message, { media: urlMedia ?? null })
			return res.end('sended')
		})
	)

	adapterProvider.server.post(
		'/v1/register',
		handleCtx(async (bot, req, res) => {
			const { number, name } = req.body
			await bot.dispatch('REGISTER_FLOW', { from: number, name })
			return res.end('trigger')
		})
	)

	adapterProvider.server.post(
		'/v1/samples',
		handleCtx(async (bot, req, res) => {
			const { number, name } = req.body
			await bot.dispatch('SAMPLES', { from: number, name })
			return res.end('trigger')
		})
	)

	adapterProvider.server.post(
		'/v1/blacklist',
		handleCtx(async (bot, req, res) => {
			const { number, intent } = req.body
			if (intent === 'remove') bot.blacklist.remove(number)
			if (intent === 'add') bot.blacklist.add(number)

			res.writeHead(200, { 'Content-Type': 'application/json' })
			return res.end(JSON.stringify({ status: 'ok', number, intent }))
		})
	)

	httpServer(+PORT)
}

main()
