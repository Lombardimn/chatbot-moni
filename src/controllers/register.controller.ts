import { ClientEntry } from "@/interfaces"

class ClientRegistry {
  private list: ClientEntry[] = []

  add(client: ClientEntry) {
    this.list.push(client)
  }

  remove(number: string) {
    this.list = this.list.filter(client => client.number !== number)
  }

  isRegistered(number: string) {
    return this.list.some(client => client.number === number)
  }

  getAllClients() {
    return this.list
  }

  getClient(number: string) {
    return this.list.find(client => client.number === number)
  }
}

export const clientRegistry = new ClientRegistry()
