import { createBot, createProvider, createFlow, addKeyword, utils, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { pillValidator } from './services'
import { welcomeFlow } from './flows'
import * as fs from 'fs';

const PORT = process.env.PORT ?? 3008

// Menu principal del modelo de negocio.
const mainFlow = addKeyword(EVENTS.WELCOME)
	.addAction(async (ctx, ctxFn) => {
		const bodyText: string = ctx.body.toLowerCase()

		// Leer el archivo JSON
		const data = fs.readFileSync('../resources/pill.json', 'utf8');
		const pills = JSON.parse(data);
		
		// Pildoras de llamadas.
		const greetings = pills.greetings

		//verificadores
		const flagGreeting = pillValidator(greetings, bodyText)

		// Respuestas.
		if (flagGreeting) {
			return ctxFn.gotoFlow(welcomeFlow)
		}
		
		return await ctxFn.flowDynamic('flujo de falla de lectura de mensaje')
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
	const adapterFlow = createFlow([welcomeFlow, registerFlow])

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
