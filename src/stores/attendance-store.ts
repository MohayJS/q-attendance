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
      const record = await firebaseService.createRecord('meetings', {
        ...payload,
        checkIns: undefined
      });
      if (record) {
        this.meetings.push(record);
      }
    },
    async loadClassMeetings(classKey: string, condition?: { student?: string | undefined }) {
      try {
        const records = await firebaseService.findRecords('meetings', undefined, {
          classKey: { '==': classKey }
        });
        const classMeetings = await Promise.all(records.map(async m => {
          m.checkIns = [];
          m.checkInCount = 0;
          if (condition?.student) {
            m.checkIns = await firebaseService.findRecords('check-ins', `/meetings/${m.key}`, {
              key: { '==': condition.student }
            })
          } else {
            m.checkInCount = await firebaseService.countRecords('check-ins', `/meetings/${m.key}`)
          }
          return m;
        }));
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
        const checkInRecord: MeetingCheckInModel = {
          key: payload.student,
          checkInTime: date.formatDate(new Date(), 'HH:mm:ss'),
          status: payload.status || 'check-in',
        };
        await firebaseService.createRecord('check-ins',
          checkInRecord,
          `/meetings/${payload.meeting.key}`
        );
        return checkInRecord;
      } catch (error) {
        console.error('Error checking in:', error);
        throw error;
      }
    },

    // hasStudentCheckedIn(meetingKey: string, studentKey: string): boolean {
    //   const meeting = this.meetings.find(m => m.key === meetingKey);
    //   if (!meeting || !meeting.checkIns) return false;

    //   return meeting.checkIns.some(checkIn => checkIn.key === studentKey);
    // },

    // getStudentAttendanceStatus(meetingKey: string, studentKey: string): MeetingCheckInModel['status'] | null {
    //   const meeting = this.meetings.find(m => m.key === meetingKey);
    //   if (!meeting || !meeting.checkIns) return null;

    //   const checkIn = meeting.checkIns.find(checkIn => checkIn.key === studentKey);
    //   return checkIn ? checkIn.status : null;
    // },

    async loadMeeting(meetingKey: string) {
      const [record, checkIns] = await Promise.all([
        firebaseService.getRecord('meetings', meetingKey),
        firebaseService.findRecords('check-ins', `/meetings/${meetingKey}`)
      ]);
      if (record) {
        record.checkIns = checkIns || [];
        return record;
      }
    },

    async updateCheckInStatus(payload: {
      meetingKey: string;
      checkInKey: string;
      student: string;
      status: MeetingCheckInModel['status'];
    }) {
      try {
        const path = `/meetings/${payload.meetingKey}`
        const existingRecord = await firebaseService.getRecord('check-ins', payload.student, path);
        const marked = existingRecord?.status == 'check-in' && payload.status != 'check-in';
        await firebaseService.updateRecord('check-ins', payload.student, {
          status: payload.status,
          markedInTime: marked ? date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss') : ''
        }, path);
        return true;
      } catch (error) {
        console.error('Error updating check-in status:', error);
        throw error;
      }
    },

    async concludeMeeting(meetingKey: string) {
      try {
        const existingMeeting = await firebaseService.getRecord('meetings', meetingKey);
        if (!existingMeeting) {
          throw new Error('Meeting not found');
        }
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
        const existingMeeting = await firebaseService.getRecord('meetings', meetingKey);
        if (!existingMeeting) {
          throw new Error('Meeting not found');
        }
        await firebaseService.updateRecord('meetings', meetingKey, {
          status: 'open'
        });

        return true;
      } catch (error) {
        console.error('Error re-opening meeting:', error);
        throw error;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAttendanceStore, import.meta.hot));
}
