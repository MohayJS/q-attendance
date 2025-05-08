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

    async loadClassMeetings(classKey: string) {
      try {
        // Fetch meetings from Firebase for the specific class
        const records = await firebaseService.findRecords('meetings');

        // Filter meetings for the specific class
        this.meetings = records.filter(meeting => meeting.classKey === classKey);
        return this.meetings;
      } catch (error) {
        console.error('Error loading class meetings:', error);
        return [];
      }
    },

    // Check if a meeting already exists for a specific class, date and time
    async checkExistingMeeting(classKey: string, dateTime: string) {
      // Make sure we have the latest meetings
      await this.loadClassMeetings(classKey);

      // Check if a meeting already exists for this date and time
      return this.meetings.some(meeting =>
        meeting.classKey === classKey &&
        meeting.date === dateTime
      );
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
