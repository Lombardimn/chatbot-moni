import { blacklist, clientRegistry, orderRegistry } from '@/controllers'
import { formatDate, getLastRow, readSheet, writeSheet } from '@/services'

export const setupRoutes = (adapterProvider: any, handleCtx: any) => {
  adapterProvider.server.post('/v1/messages', handleCtx(async (bot, req, res) => {
    const { number, message, urlMedia } = req.body
    await bot.sendMessage(number, message, { media: urlMedia ?? null })
    return res.end('sended')
  }))

  adapterProvider.server.post('/v1/register', handleCtx(async (bot, req, res) => {
    const { number, name, address, hourDelivery, intent } = req.body
    const updatedAt = new Date()
    const createdAt = new Date()

    if (intent === 'add') {
      // Leer el registro de Google Sheets
      const lastRow = await getLastRow('Clientes')
      const data = await readSheet(`Clientes!A1:F${lastRow}`)

      if (data && data.find((item: any) => item['Número'] === number)) {
        return res.end('already registered')
      } else {
        // Registrar el cliente en el registro local
        clientRegistry.add({ number, name, address, hourDelivery, updatedAt, createdAt })
        console.log('Cliente registrado:', { number, name, address, hourDelivery, updatedAt, createdAt })
  
        // Escribir el nuevo registro en Google Sheets
        const newRange = `Clientes!A${lastRow + 1}:F${lastRow + 1}`
        await writeSheet([
          [
            number,
            name,
            address,
            hourDelivery,
            formatDate(updatedAt),
            formatDate(createdAt)
          ]
        ], newRange)
      }
    }

    if (intent === 'initialize') {
      clientRegistry.add({ number, name, address, hourDelivery, updatedAt, createdAt })
    }

    res.writeHead(200, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ status: 'ok', number, name }))
  }))

  adapterProvider.server.get('/v1/register', handleCtx(async (bot, req, res) => {
    const { number, intent } = req.query

    if (intent === 'geter') {
      console.log(`Buscando cliente con número: ${number}`)
      
      const client = clientRegistry.getClient(number)
      
      console.log('Cliente encontrado:', client)
      
      return res.end(JSON.stringify(client))
    }

    res.writeHead(200, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify(clientRegistry))
  }))

  adapterProvider.server.post('/v1/blacklist', handleCtx(async (bot, req, res) => {
    const { number, name, intent, duration } = req.body
    
    if (intent === 'remove') {
      blacklist.remove(number)
    }

    if (intent === 'add') {
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

    if (intent === 'initialize') {
      blacklist.add({
        number,
        name,
        expiresAt: duration
      })
    }

    res.writeHead(200, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ status: 'ok', number, name, intent }))
  }))

  adapterProvider.server.get('/v1/blacklist', handleCtx(async (bot, req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify(blacklist))
  }))

  adapterProvider.server.post('/v1/orders', handleCtx(async (bot, req, res) => {
    const { number, name, address, hourDelivery, intent } = req.body
    const createdAt = new Date()

    if (intent === 'add') {
      // Buscamos si ya ha registrado una orden en Google Sheets
      const lastRow = await getLastRow('Movimientos')
      const data = await readSheet(`Movimientos!A10:F${lastRow}`)

      if (data && data.find((item: any) => item['Número'] === number)) {
        return res.end('already registered')
      } else {
        // Registrar la orden en Google Sheets
        const newRange = `Movimientos!A${lastRow + 1}:F${lastRow + 1}`
        await writeSheet([
          [
            number,
            name,
            address,
            hourDelivery,
            formatDate(createdAt)
          ]
        ], newRange)
      }
    }

    if (intent === 'remove') {
      orderRegistry.remove(number)
    }

    res.writeHead(200, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ status: 'ok', number, name }))
  }))
}