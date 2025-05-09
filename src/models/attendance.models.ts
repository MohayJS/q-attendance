import { Entity } from './base.model';

export interface ClassMeetingModel extends Entity {
  classKey: string;
  date: string;
  status: 'open' | 'cancelled' | 'concluded';
  teacher: string;
  checkIns?: MeetingCheckInModel[]
}
export interface MeetingCheckInModel extends Entity {
  student: string;
  checkInTime: string;
  status: 'check-in' | 'absent' | 'late' | 'present';
  markedInTime?: string;
  comments?: string;
}
