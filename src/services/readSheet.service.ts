import { SPREAD_SHEET_ID } from '@/config'
import { authGoogle } from '@/helpers'
import { google } from 'googleapis'

export const readSheet = async (range: string): Promise<any[] | void> => {
  const sheets = google.sheets({ version: 'v4', auth: authGoogle }) // Crea una instancia de Sheets API

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREAD_SHEET_ID,
      range
    })

    const rows = response.data.values
    if (rows && rows.length > 0) {
      const headers = rows[0] // Primera fila como encabezados
      const data = rows.slice(1).map((row) => {
        const rowData: { [key: string]: any } = {}
        headers.forEach((header, index) => {
          rowData[header] = row[index]
        })
        return rowData
      })

      return data
    } else {
      console.log('No se encontraron datos en la hoja.')
      return []
    }
  } catch (error) {
    console.error('Se ha producido un error en la lectura de la hoja -> :', error)
  }
}
