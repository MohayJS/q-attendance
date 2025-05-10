import { Entity } from './base.model';

export interface ClassMeetingModel extends Entity {
  classKey: string;
  date: string;
  status: 'open' | 'cancelled' | 'concluded';
  teacher: string;
  checkIns?: MeetingCheckInModel[] | undefined,
  latestCheckIn?: string;
  checkInCount?: number;
}
export interface MeetingCheckInModel extends Entity {
  checkInTime: string;
  status: 'check-in' | 'absent' | 'late' | 'present';
  markedInTime?: string;
  comments?: string;
}
