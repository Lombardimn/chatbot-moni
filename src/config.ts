import dotenv from 'dotenv'

dotenv.config()

// PARAMETROS DE CONEXION

export const PORT = process.env.PORT ?? 3008

// PARAMETROS DE USO

export const PILL_PATH = process.env.PILL_PATH ?? '/pill.json'


// RUTAS API

export const API_BLACKLIST = process.env.API_BLACKLIST ?? '/blacklist'
