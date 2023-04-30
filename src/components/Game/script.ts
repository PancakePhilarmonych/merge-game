import { defineComponent, onMounted } from "vue";
import * as PIXI from 'pixi.js'
import creatures from '../../store'

function randomColorHex() {
  let hex = "#";
  let possible = "ABCDEF0123456789";

  for (let i = 0; i < 6; i++) {
    hex += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return hex;
}

function changeColor(context: CanvasRenderingContext2D) {
  context.fillStyle = randomColorHex();
  context.fillRect(0,0,window.innerWidth,window.innerHeight);
}


export default defineComponent({
  name: 'game-component',
  setup() {
    const counterStore = creatures()
    const app = new PIXI.Application({
      antialias: true,
    });

    onMounted(() => {
      const canvas = document.getElementById('game-view') as HTMLCanvasElement;
      var ctx = canvas.getContext("2d");

      if(ctx) {
        changeColor(ctx);
      }
    })

    return { counterStore, app }
  },

  methods: {}
})
