import { defineComponent } from "vue";

export default defineComponent({
  name: 'sidebar-component',
  methods: {
    onClick() {
      console.log('Кнопка для всего сработала');
    }
  }
})
