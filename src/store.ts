import { defineStore } from 'pinia'

export default defineStore('counter', {
  state: () => ({
    wolf: 0,
    rabbit: 0,
  }),
  actions: {
    killWolf() {
      if(this.wolf !== 0)
      this.wolf--
    },
    killRabbit() {
      if(this.rabbit !== 0)
      this.rabbit--
    },
    addWolf() {
      this.wolf++
    },
    addRabbit() {
      this.rabbit++
    }
  },
})
