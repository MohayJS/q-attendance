export interface ClassMeetingModel {
  key: string;
  classKey: string;
  date: string;
  status: 'open' | 'cancelled' | 'concluded';
  teacher: string;
  checkIns: MeetingCheckInModel[]
}
export interface MeetingCheckInModel {
  key: string;
  student: string;
  checkInTime: string;
  status: 'check-in' | 'absent' | 'tardy' | 'present';
  markedInTime?: string;
  comments?: string;
}
