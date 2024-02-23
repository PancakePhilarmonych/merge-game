import { defineStore } from 'pinia';
import { GameObject } from 'modules/GameObject';
import { Colors } from '../utils';

export const useCounterStore = defineStore('counter', {
  state: () => {
    return { count: 0, best: 0, timerFill: 100, color: Colors.EMPTY };
  },
  actions: {
    updateTimerBar(v: number) {
      this.timerFill = v;
    },
    increment(n?: number) {
      n ? (this.count += n) : this.count++;

      const best = localStorage.getItem('best');
      const bestNum = best ? parseInt(best) : 0;

      if (this.count > bestNum) {
        localStorage.setItem('best', this.count.toString());
      }
    },
    reset() {
      const bestFromStorage = localStorage.getItem('best');

      if (bestFromStorage) {
        this.best = parseInt(bestFromStorage);
      }

      this.count = 0;
      this.color = Colors.EMPTY;
      this.timerFill = 100;
    },
    select(object: GameObject | null) {
      if (!object) {
        this.color = Colors.EMPTY;
        return;
      }
      this.color = object.getColor();
    },
  },
});
