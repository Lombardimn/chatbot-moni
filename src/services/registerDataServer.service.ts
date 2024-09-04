import { API_BLACKLIST, API_REGISTER } from "@/config"
import { getLastRow } from "./getLastRow.service"
import { readSheet } from "./readSheet.service"
import { BlacklistEntry, ClientEntry } from "@/interfaces"
import { revertDateFormat } from "./formatDate.service"

export const registerDataServer = async () => {
  try {
    // Leer datos en Google Sheets para clientes
    const lastRowClient = await getLastRow('Clientes')
    const clients = await readSheet(`Clientes!A1:F${lastRowClient}`)

    // Cargar los datos en el servidor
    if (Array.isArray(clients)) {
      // Mapear los datos leidos para enviarlos al servidor
      const mappedClients = clients.map((client: any): ClientEntry => ({
        number: client['Número'],
        name: client['Nombre'],
        address: client['Dirección'],
        hourDelivery: client['Hora de Entrega'],
        updatedAt: new Date(client['UpdatedAt']),
        createdAt: new Date(client['CreatedAt']),
      }))


      // Cargar los datos en el servidor
      mappedClients.forEach((client: ClientEntry) => {
        fetch( API_REGISTER, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            intent: 'initialize',
            number: client.number,
            name: client.name,
            address: client.address,
            hourDelivery: client.hourDelivery
          })
        })
      })

      console.log(`Se ha realizado la carga de: ${mappedClients.length} registros de Clientes.`)
    }

    // Leer datos en Google Sheets para ingnorados
    const lastRowBlacklist = await getLastRow('Blacklist')
    const blacklist = await readSheet(`Blacklist!A1:D${lastRowBlacklist}`)
    
    if (Array.isArray(blacklist)) {
      // mapear los datos leidos para enviarlos al servidor
      const mappedBlacklist = blacklist.map((data: any): BlacklistEntry => ({
        number: blacklist['NUMERO'],
        name: data['NOMBRE'],
        expiresAt: revertDateFormat(data['HORA DE ACTIVACION']),
      }))

      const list: BlacklistEntry[] = []
      // Eliminar registros con fechas pasadas
      mappedBlacklist.map((data: any) => {
        console.log('dataexp: ', data.expiresAt, 'newDate: ', new Date())
        if (new Date(data.expiresAt) >= new Date()) {
          list.push(data)
        }
      })


      // Cargar los datos en el servidor
      list.forEach((user: BlacklistEntry) => {
        fetch( API_BLACKLIST, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            intent: 'initialize',
            number: user.number,
            name: user.name,
            duration: user.expiresAt
          })
        })
      })

      console.log(`Se ha realizado la carga de: ${list.length} registros de Usuarios Bloqueados.`)
    }

  } catch (error) {
    console.error('Error al querer cargar los datos en los servidores: ', error)
  }
}