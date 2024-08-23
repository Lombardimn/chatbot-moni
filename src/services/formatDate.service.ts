// Función para formatear la fecha en DD-MM-AAAA HH:MM
export function formatDate(date: Date): string {
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,  // 24 horas
  }).replace(',', '');
}