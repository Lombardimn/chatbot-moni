// Función para formatear la fecha en DD-MM-AAAA HH:MM
export function formatDate(date: Date): string {
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,  // 24 horas
  }).replace(',', '')
}

// Función para revertir la fecha al formato original YYYY-MM-DDTHH:MM:SS.SSSZ en hora local
export function revertDateFormat(formattedDate: string): string | null {
  const [datePart, timePart] = formattedDate.split(' ')

  // Verifica que tanto la fecha como la hora estén presentes
  if (!datePart || !timePart) {
    console.error('Error: Formato de fecha incorrecto')
    return null
  }

  const [day, month, year] = datePart.split('/')
  const [hours, minutes, seconds] = timePart.split(':')

  // Verifica que todos los componentes de la fecha y la hora sean válidos
  if (!day || !month || !year || !hours || !minutes) {
    console.error('Error: Componentes de fecha/hora incorrectos')
    return null
  }

  // Crear una fecha usando la zona horaria local
  const localDate = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds))

  // Ajustar a UTC y devolver en formato ISO
  return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString()
}
