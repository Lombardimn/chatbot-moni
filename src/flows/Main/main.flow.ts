import { pillValidator, readFile } from "@/services"
import { welcomeFlow, supportFlow, liveAgentFlow, feedbackFlow, registerFlow, orderFlow } from "@/flows"
import { addKeyword, EVENTS } from "@builderbot/bot"
import { PILL_PATH } from "@/config"
import { blacklist } from "@/controllers"

// Menu principal del modelo de negocio.
export const mainFlow = addKeyword(EVENTS.WELCOME)
	.addAction(async (ctx, { gotoFlow }) => {
		const bodyText: string = ctx.body.toLowerCase()
    
    // Verificar si el número está en la blacklist
    const userNumber: string = ctx.from
        
    if (blacklist.isBlacklisted(userNumber)) {
        console.log(`Número ${userNumber} está en la blacklist, no se activará ningún flujo.`);
        return // No se activa ningún flujo
    }

		// Verificar si esta registrado
		if (bodyText.includes('ordenar')) {
			console.log(`El usuario ${userNumber} está registrado.`)
			return gotoFlow(orderFlow) //Se envia a la gestión de ordenes
		}
		
		if (bodyText.includes('registrar')) {
				return gotoFlow(registerFlow)	
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
			return gotoFlow(welcomeFlow)
		}

		if (!flagGreeting && flagSupport && !flagLiveAgent) {
			return gotoFlow(supportFlow)
		}

		if (flagGreeting && flagSupport && !flagLiveAgent) {
			return gotoFlow(supportFlow)
		}

		if (flagGreeting && !flagSupport && flagLiveAgent) {
			return gotoFlow(liveAgentFlow)
		}

    if (!flagGreeting && !flagSupport && flagLiveAgent) {
			return gotoFlow(liveAgentFlow)
		}
		
		return gotoFlow(feedbackFlow)
	})