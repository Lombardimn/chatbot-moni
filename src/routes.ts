import { blacklist } from '@/controllers'
import { formatDate, getLastRow, writeSheet } from '@/services'

export const setupRoutes = (adapterProvider: any, handleCtx: any) => {
  adapterProvider.server.post('/v1/messages', handleCtx(async (bot, req, res) => {
    const { number, message, urlMedia } = req.body
    await bot.sendMessage(number, message, { media: urlMedia ?? null })
    return res.end('sended')
  }))

  adapterProvider.server.post('/v1/register', handleCtx(async (bot, req, res) => {
      const { number, name } = req.body
      await bot.dispatch('REGISTER_FLOW', { from: number, name })
      return res.end('trigger')
  }))

  adapterProvider.server.post('/v1/samples', handleCtx(async (bot, req, res) => {
      const { number, name } = req.body
      await bot.dispatch('SAMPLES', { from: number, name })
      return res.end('trigger')
  }))

  adapterProvider.server.post('/v1/blacklist', handleCtx(async (bot, req, res) => {
      const { number, name, intent, duration } = req.body
      if (intent === 'remove') {
        blacklist.remove(number)
      }

      if (intent === 'add'){
        const now = new Date()
        const expirationDate = new Date(now.getTime() + duration * 60 * 1000) // duración en minutos
        
        blacklist.add({ 
          number,
          name,
          expiresAt: expirationDate 
        })

        // Leer la ultima fila de Google Sheets
        const lastRow = await getLastRow('Blacklist')
        const newRange = `Blacklist!A${lastRow + 1}:D${lastRow + 1}`

        // Carga en Google Sheets
        await writeSheet(
          [[
            formatDate(now),
            number,
            name,
            formatDate(expirationDate)
          ]],
          newRange
        )
      }

      res.writeHead(200, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ status: 'ok', number, name, intent }))
  }))

  adapterProvider.server.get('/v1/blacklist', handleCtx(async (bot, req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify(blacklist))
  }))
}