import { defineStore } from 'pinia';
import { GameObject } from 'modules/GameObject';
import { Colors } from '../utils';

export const useCounterStore = defineStore('counter', {
  state: () => {
    return { count: 0, color: Colors.EMPTY };
  },
  actions: {
    increment(n?: number) {
      n ? (this.count += n) : this.count++;
    },
    reset() {
      this.count = 0;
      this.color = Colors.EMPTY;
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
