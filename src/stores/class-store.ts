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
    async loadClassesByTeacher(key: string) {
      const records = await firebaseService.findRecords('classes');

      const filteredRecords = records.filter((record) => {
        return record.teachers?.some(teacher => teacher.key === key);
      })
      this.classes = filteredRecords;
      return this.classes;
    },

    async loadClassesByStudent(key: string) {
      const allClasses = await firebaseService.findRecords('classes');

      const enrolledClasses = allClasses.filter(cls =>
        cls.enrolledStudents?.includes(key)
      );

      this.classes = enrolledClasses;
      return this.classes;
    },

    async findClassByCode(classCode: string) {
      const records = await firebaseService.findRecords('classes');
      const foundClass = records.find(record => record.classCode === classCode);

      return foundClass;
    },
    async loadClass(key: string) {
      const record = await firebaseService.getRecord('classes', key);
      if (record) {
        this.classes.push(record);
        return record;
      }
    },
    async deleteClass(key: string) {
      await firebaseService.deleteRecord('classes', key);
      this.classes = this.classes.filter(c => c.key !== key);
    },

    async saveClass(payload: ClassModel) {
      const record = await firebaseService.createRecord('classes', payload);
      if (record) {
        this.classes.push(record);
      }
      console.log(record);
    },

    async enroll(payload: {
      class: ClassModel,
      student: UserModel
    }) {
      const cls = this.classes.find(c => c.key === payload.class.key) || payload.class;

      if (!cls.enrolledStudents) {
        cls.enrolledStudents = [];
      }

      if (payload.student.key && !cls.enrolledStudents.includes(payload.student.key)) {
        cls.enrolledStudents.push(payload.student.key);

        if (cls.key) {
          await firebaseService.updateRecord('classes', cls.key, {
            enrolledStudents: cls.enrolledStudents
          });
        }

        if (!cls.enrolled) {
          cls.enrolled = [];
        }
        cls.enrolled.push(payload.student);
      }
    },
    async join(payload: { class: ClassModel, teacher: UserModel}) {
      console.log(payload);
      const record = await firebaseService.createRecord('teachers', payload.teacher, `/classes/${payload.class.key}`);
      const cls = this.classes.find(c => c.key == payload.class.key);
      if (record && cls) {
        cls.teachers = cls.teachers || [];
        cls.teachers.push(record);
      }
    },

    async unenroll(payload: {
      classKey: string,
      studentKey: string
    }) {
      try {
        const cls = this.classes.find(c => c.key === payload.classKey);

        if (!cls || !cls.key) {
          console.error('Class not found');
          return false;
        }

        if (!cls.enrolledStudents) {
          console.error('No enrolled students found');
          return false;
        }

        if (!cls.enrolledStudents.includes(payload.studentKey)) {
          console.error('Student not enrolled in this class');
          return false;
        }

        cls.enrolledStudents = cls.enrolledStudents.filter(key => key !== payload.studentKey);

        await firebaseService.updateRecord('classes', cls.key, {
          enrolledStudents: cls.enrolledStudents
        });

        if (cls.enrolled) {
          cls.enrolled = cls.enrolled.filter(student => student.key !== payload.studentKey);
        }

        this.classes = this.classes.filter(c => !(c.key === payload.classKey && c.enrolledStudents && !c.enrolledStudents.includes(payload.studentKey)));

        return true;
      } catch (error) {
        console.error('Error unenrolling student:', error);
        return false;
      }
    }
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useClassStore, import.meta.hot));
}
