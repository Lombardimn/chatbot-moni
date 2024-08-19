import * as fs from 'fs'

export const readFile = (path: string, option: string) => {
  // Leer el archivo JSON
  const data = fs.readFileSync( path, 'utf8')
  const result = JSON.parse(data)
  const  value = result[option]

  return value
}