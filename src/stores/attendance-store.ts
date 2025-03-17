import { defineStore, acceptHMRUpdate } from 'pinia';
import type { Attendance, EnrolledStudents } from 'src/models/attendance.models';

export const useAttendanceStore = defineStore('attendance', {
  state: () => ({
    students: [] as EnrolledStudents[],
    attendance: [] as Attendance[]
  }),

  getters: {

  },
  actions: {
    enrollNewStudent(payload: EnrolledStudents) {
      this.students.push(payload);
    },
    recordAttendance(payload: {
      key: string;
      student: EnrolledStudents,
      status: Attendance['status'],
      date: string
    }) {
      this.attendance.push({
        key: payload.key,
        date: payload.date,
        status: payload.status,
        enrollKey: payload.student.key,
        comments: ''
      });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAttendanceStore, import.meta.hot));
}
