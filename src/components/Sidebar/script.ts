import { defineComponent } from "vue";
import creatures from '../../store'
import { mapActions } from 'pinia'

export default defineComponent({
  name: 'sidebar-component',
  methods: {
    ...mapActions(creatures, ['addWolf', 'addRabbit', 'killRabbit', 'killWolf']),
  }
})
