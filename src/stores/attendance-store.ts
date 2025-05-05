import { defineStore, acceptHMRUpdate } from 'pinia';
import { date } from 'quasar';
import type { ClassMeetingModel, MeetingCheckInModel } from 'src/models/attendance.models';
import { firebaseService } from 'src/services/firebase-service';

export const useAttendanceStore = defineStore('attendance', {
  state: () => ({
    meetings: [] as ClassMeetingModel[]
  }),

  getters: {

  },
  actions: {
    async newClassMeeting(payload: ClassMeetingModel) {
      const record = await firebaseService.createRecord('meetings', payload);
      if (record) {
        this.meetings.push(record);
      }
    },
    async checkInAttendance(payload: {
      student: string;
      meeting: ClassMeetingModel,
      status: MeetingCheckInModel['status']
    }) {

      await firebaseService.createRecord('check-ins', {
        checkInTime: date.formatDate(new Date(), 'HH:mm:ss'),
        key: '',
        status: payload.status || 'check-in',
        student: payload.student
      }, `meetings/${payload.meeting.key}/checkIns`);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAttendanceStore, import.meta.hot));
}
