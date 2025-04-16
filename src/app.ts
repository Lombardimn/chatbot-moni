import { createBot, createProvider, createFlow, MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { mainFlow, registerFlow, welcomeFlow, supportFlow, feedbackFlow, liveAgentFlow } from '@/flows'
import { PORT } from '@/config'
import { setupRoutes } from '@/routes'
import { startBlacklistCleaner } from '@/controllers'
import { registerDataServer } from '@/services'

const setupServer = async () => {
    const adapterFlow = createFlow([mainFlow, welcomeFlow, supportFlow, feedbackFlow, liveAgentFlow, registerFlow])
    const adapterProvider = createProvider(Provider)
    const adapterDB = new Database()

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    
    httpServer(+PORT)

     // Configurar rutas
    setupRoutes(adapterProvider, handleCtx)

     // Iniciar la tarea programada para limpiar la blacklist
    startBlacklistCleaner()

    // Inicio el servidor con todos los registros de clientes
    registerDataServer()

}

setupServer()
