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
        const records = await firebaseService.findRecords('meetings');

        const classMeetings = records.filter(meeting => meeting.classKey === classKey);

        for (const meeting of classMeetings) {
          if (!meeting.checkIns) {
            meeting.checkIns = [];
          }
        }

        this.meetings = classMeetings;
        return this.meetings;
      } catch (error) {
        console.error('Error loading class meetings:', error);
        return [];
      }
    },

    async checkExistingMeeting(classKey: string, dateTime: string) {
      await this.loadClassMeetings(classKey);

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
      try {
        const meetingIndex = this.meetings.findIndex(m => m.key === payload.meeting.key);
        if (meetingIndex === -1) {
          throw new Error('Meeting not found');
        }

        const meeting = this.meetings[meetingIndex];
        if (!meeting) {
          throw new Error('Meeting not found');
        }

        if (!meeting.checkIns) {
          meeting.checkIns = [];
        }

        const existingCheckInIndex = meeting.checkIns.findIndex(c => c.student === payload.student);

        const checkInRecord: MeetingCheckInModel = {
          checkInTime: date.formatDate(new Date(), 'HH:mm:ss'),
          key: existingCheckInIndex !== -1 && meeting.checkIns[existingCheckInIndex]
            ? meeting.checkIns[existingCheckInIndex].key || ''
            : '',
          status: payload.status || 'check-in',
          student: payload.student
        };

        if (existingCheckInIndex === -1) {
          meeting.checkIns.push(checkInRecord);
        } else {
          meeting.checkIns[existingCheckInIndex] = checkInRecord;
        }

        await firebaseService.updateRecord('meetings', meeting.key, {
          checkIns: meeting.checkIns
        });

        return checkInRecord;
      } catch (error) {
        console.error('Error checking in:', error);
        throw error;
      }
    },

    hasStudentCheckedIn(meetingKey: string, studentKey: string): boolean {
      const meeting = this.meetings.find(m => m.key === meetingKey);
      if (!meeting || !meeting.checkIns) return false;

      return meeting.checkIns.some(checkIn => checkIn.student === studentKey);
    },

    getStudentAttendanceStatus(meetingKey: string, studentKey: string): MeetingCheckInModel['status'] | null {
      const meeting = this.meetings.find(m => m.key === meetingKey);
      if (!meeting || !meeting.checkIns) return null;

      const checkIn = meeting.checkIns.find(checkIn => checkIn.student === studentKey);
      return checkIn ? checkIn.status : null;
    },

    async updateCheckInStatus(payload: {
      meetingKey: string;
      checkInKey: string;
      student: string;
      status: MeetingCheckInModel['status'];
    }) {
      try {
        const meetingIndex = this.meetings.findIndex(m => m.key === payload.meetingKey);
        if (meetingIndex === -1) {
          throw new Error('Meeting not found');
        }

        const meeting = this.meetings[meetingIndex];
        if (!meeting) {
          throw new Error('Meeting not found');
        }

        if (!meeting.checkIns) {
          meeting.checkIns = [];
        }

        let checkInIndex = -1;

        if (payload.checkInKey) {
          checkInIndex = meeting.checkIns.findIndex(c => c.key === payload.checkInKey);
        }

        if (checkInIndex === -1) {
          checkInIndex = meeting.checkIns.findIndex(c => c.student === payload.student);
        }

        if (checkInIndex !== -1 && meeting.checkIns[checkInIndex]) {
          const existingRecord = meeting.checkIns[checkInIndex]!;
          existingRecord.status = payload.status;
          if (existingRecord.status !== 'check-in' && payload.status !== 'check-in') {
            existingRecord.markedInTime = date.formatDate(new Date(), 'HH:mm:ss');
          }
        } else {
          const checkInRecord = {
            key: '',
            student: payload.student,
            checkInTime: date.formatDate(new Date(), 'HH:mm:ss'),
            status: payload.status
          } as MeetingCheckInModel;

          if (payload.status !== 'check-in') {
            checkInRecord.markedInTime = date.formatDate(new Date(), 'HH:mm:ss');
          }

          meeting.checkIns.push(checkInRecord);
        }

        await firebaseService.updateRecord('meetings', payload.meetingKey, {
          checkIns: meeting.checkIns
        });

        return true;
      } catch (error) {
        console.error('Error updating check-in status:', error);
        throw error;
      }
    },

    async concludeMeeting(meetingKey: string) {
      try {
        const meetingIndex = this.meetings.findIndex(m => m.key === meetingKey);
        if (meetingIndex === -1) {
          throw new Error('Meeting not found');
        }

        const meeting = this.meetings[meetingIndex];
        if (!meeting) {
          throw new Error('Meeting not found');
        }

        meeting.status = 'concluded';

        await firebaseService.updateRecord('meetings', meetingKey, {
          status: 'concluded'
        });

        return true;
      } catch (error) {
        console.error('Error concluding meeting:', error);
        throw error;
      }
    },

    async reopenMeeting(meetingKey: string) {
      try {
        const meetingIndex = this.meetings.findIndex(m => m.key === meetingKey);
        if (meetingIndex === -1) {
          throw new Error('Meeting not found');
        }

        const meeting = this.meetings[meetingIndex];
        if (!meeting) {
          throw new Error('Meeting not found');
        }

        meeting.status = 'open';

        await firebaseService.updateRecord('meetings', meetingKey, {
          status: 'open'
        });

        return true;
      } catch (error) {
        console.error('Error reopening meeting:', error);
        throw error;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAttendanceStore, import.meta.hot));
}
