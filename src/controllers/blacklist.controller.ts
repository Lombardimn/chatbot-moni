import { BlacklistEntry } from "@/interfaces"

class Blacklist {
  private list: BlacklistEntry[] = []

  add(user: BlacklistEntry) {
      this.list.push(user)
  }

  remove(number: string) {
      this.list = this.list.filter(user => user.number !== number)
  }

  isBlacklisted(number: string) {
      return this.list.some(user => user.number === number)
  }

  checkExpired() {
      const now = new Date()
      this.list = this.list.filter(user => {
          if (user.expiresAt > now) {
              return true
          } else {
              console.log(`Removing ${user.number} from blacklist`)
              return false
          }
      });
  }
}

export const blacklist = new Blacklist()

// Configurar la tarea programada para limpiar la blacklist
export const startBlacklistCleaner = () => {
  setInterval(() => {
      console.log('Cleaning blacklist')
      blacklist.checkExpired()
  }, 300000) // Verifica cada minuto (60000 = 1 min)
}
