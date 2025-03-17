import { defineStore, acceptHMRUpdate } from 'pinia';
import type { ClassModel } from 'src/models/class.models';

export const useClassStore = defineStore('Class', {
  state: () => ({
    classes: [] as ClassModel[],
  }),

  getters: {

  },

  actions: {
    saveClass(payload: ClassModel) {
      this.classes.push(payload)
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useClassStore, import.meta.hot));
}
