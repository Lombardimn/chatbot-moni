import { pillValidator, readFile } from "@/services"
import { welcomeFlow } from "./welcome.flow"
import { supportFlow } from "./support.flow"
import { liveAgentFlow } from "./liveAgent.flow"
import { feedbackFlow } from "./feedback.flow"
import { addKeyword, EVENTS } from "@builderbot/bot"
import { PILL_PATH } from "@/config"
import { blacklist } from "@/controllers"
import { registerFlow } from "./register.flow"

// Menu principal del modelo de negocio.
export const mainFlow = addKeyword(EVENTS.WELCOME)
	.addAction(async (ctx, ctxFn) => {
		const bodyText: string = ctx.body.toLowerCase()
    
    // Verificar si el número está en la blacklist
    const userNumber: string = ctx.from
        
    if (blacklist.isBlacklisted(userNumber)) {
        console.log(`Número ${userNumber} está en la blacklist, no se activará ningún flujo.`);
        return // No se activa ningún flujo
    }

		if (bodyText.includes('registrar')) {
			return ctxFn.gotoFlow(registerFlow)
		}

		// Pildoras de llamadas.
		const greetings = readFile(PILL_PATH, 'greetings')
		const support = readFile(PILL_PATH, 'support')
		const liveAgent = readFile(PILL_PATH, 'liveAgent')

		//verificadores
		const flagGreeting = pillValidator(greetings, bodyText)
		const flagSupport = pillValidator(support, bodyText)
		const flagLiveAgent = pillValidator(liveAgent, bodyText)

		// Respuestas.
		if (flagGreeting && !flagSupport && !flagLiveAgent) {
			return ctxFn.gotoFlow(welcomeFlow)
		}

		if (!flagGreeting && flagSupport && !flagLiveAgent) {
			return ctxFn.gotoFlow(supportFlow)
		}

		if (flagGreeting && flagSupport && !flagLiveAgent) {
			return ctxFn.gotoFlow(supportFlow)
		}

		if (flagGreeting && !flagSupport && flagLiveAgent) {
			return ctxFn.gotoFlow(liveAgentFlow)
		}

    if (!flagGreeting && !flagSupport && flagLiveAgent) {
			return ctxFn.gotoFlow(liveAgentFlow)
		}
		
		return await ctxFn.gotoFlow(feedbackFlow)
	})