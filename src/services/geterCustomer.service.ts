import { API_REGISTER } from "@/config"

export const geterCustomer = async (userNumber: string) => {
  try {
    const res = await fetch(`${API_REGISTER}?intent=geter&number=${userNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Verifica el estado de la respuesta
    if (!res.ok) {
      throw new Error(`Error en la solicitud: ${res.status} ${res.statusText}`)
    } else {
      console.log('Petición exitosa')
    }
    
    const response = await res.json();
    console.log(response)

    return response

  } catch (error) {
    console.error('Error en la solicitud fetch:', error)
  }
}