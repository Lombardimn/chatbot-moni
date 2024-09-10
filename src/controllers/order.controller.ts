import { OrderEntry } from '@/interfaces'

class OrderRegistry {
  private list: OrderEntry[] = []

  add(order: OrderEntry) {
    this.list.push(order)
  }

  remove(number: string) {
    this.list = this.list.filter(order => order.number !== number)
  }

  isOrdered(number: string) {
    return this.list.some(order => order.number === number)
  }

  getAllOrders() {
    return this.list
  }

  getOrder(number: string) {
    return this.list.find(order => order.number === number)
  }
}

export const orderRegistry = new OrderRegistry()