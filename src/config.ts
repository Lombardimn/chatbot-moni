import dotenv from 'dotenv'

dotenv.config()

// PARAMETROS DE CONEXION

export const PORT = process.env.PORT ?? 3008

// PARAMETROS DE USO

export const PILL_PATH = process.env.PILL_PATH ?? '/pill.json'

// PARAMETROS DE GOOGLE SHEETS

export const CREDENTIALS_GOOGLE = process.env.CREDENTIALS_GOOGLE ?? '/key.json'
export const SPREAD_SHEET_ID = process.env.SPREAD_SHEET_ID ?? 'KEYSHEETID'
export const SCOPE_GOOGLE = process.env.SCOPE_GOOGLE ?? '//www.googleapis.com'

// RUTAS API

export const API_BLACKLIST = process.env.API_BLACKLIST ?? '/blacklist'
export const API_REGISTER = process.env.API_REGISTER ?? '/register'
