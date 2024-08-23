import { SPREAD_SHEET_ID } from "@/config"
import { authGoogle } from "@/helpers"
import { GaxiosResponse } from "gaxios"
import { google, sheets_v4 } from "googleapis"

export const writeSheet = async (values: any[][], range: string): Promise<GaxiosResponse<sheets_v4.Schema$UpdateValuesResponse> | void> => {
  const sheets = google.sheets({ version: 'v4', auth: authGoogle }) // Crea una instancia de Sheets API
  const valueInputOption = 'USER_ENTERED' // Crea una instancia de ValueInputOption

  const resource = {
    values // Los datos que se van a escribir
  }

  try {
    const responsed = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREAD_SHEET_ID,
      range,
      valueInputOption,
      requestBody: resource
    })

    return responsed // Devuelve la respuesta de la escritura de la hoja
  } catch (error) {
    console.error('Se ha producido un error en la escritura de la hoja -> :', error)
  }
}