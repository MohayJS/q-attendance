import { defineStore, acceptHMRUpdate } from 'pinia';
import type { ClassModel } from 'src/models/class.models';
import type { UserModel } from 'src/models/user.models';
import { firebaseService } from 'src/services/firebase-service';

export const useClassStore = defineStore('Class', {
  state: () => ({
    classes: [] as ClassModel[],
  }),

  getters: {

  },

  actions: {
    async loadClass(key: string) {
      const record = await firebaseService.getRecord('classes', key);
      if (record) {
        this.classes.push(record);
        return record;
      }
    },
    async saveClass(payload: ClassModel) {
      const record = await firebaseService.createRecord('classes', payload);
      if (record) {
        this.classes.push(record);
      }
    },
    async enroll(payload: {
      class: ClassModel,
      student: UserModel
    }) {
      const record = await firebaseService.createRecord('enrolled', payload.student, `/classes/${payload.class.key}`);
      const cls = this.classes.find(c => c.key == payload.class.key);
      if (record && cls) {
        cls.enrolled = cls.enrolled || [];
        cls.enrolled.push(record);
      }
    },
    async join(payload: {
      class: ClassModel,
      teacher: UserModel
    }) {
      const record = await firebaseService.createRecord('teachers', payload.teacher, `/classes/${payload.class.key}/teachers`);
      const cls = this.classes.find(c => c.key == payload.class.key);
      if (record && cls) {
        cls.teachers = cls.teachers || [];
        cls.teachers.push(record);
      }
    }
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useClassStore, import.meta.hot));
}
