import { SPREAD_SHEET_ID } from "@/config"
import { authGoogle } from "@/helpers"
import { google } from "googleapis"

export const getLastRow = async (sheetName: string): Promise<number> => {
  const sheets = google.sheets({ version: 'v4', auth: authGoogle }) // Crea una instancia de Sheets API

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREAD_SHEET_ID,
      range: `${sheetName}!A:A` // Lee solo la primera columna para contar las filas
    })

    const rows = response.data.values
    if (rows) {
      return rows.length // Devuelve el número de filas no vacías
    } else {
      return 0 // Si no hay filas, devuelve 0
    }
  } catch (error) {
    console.error('Error al querer obtener la cantidad de filas en la hoja:', error)
  }
}
