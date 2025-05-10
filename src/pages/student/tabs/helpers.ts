import { date } from 'quasar';
import { MeetingCheckInModel } from 'src/models/attendance.models';

export function formatDate(dateString: string | undefined) {
  if (!dateString) return 'Unknown date';

  try {
    return date.formatDate(dateString, 'MMMM D, YYYY - HH:mm');
  } catch {
    return dateString;
  }
}

export function getStatusColor(status: MeetingCheckInModel['status']): string {
  switch (status) {
    case 'present':
      return 'green';
    case 'check-in':
      return 'blue';
    case 'late':
      return 'orange';
    case 'absent':
      return 'red';
    default:
      return 'grey';
  }
}

export function getStatusLabel(status: MeetingCheckInModel['status']): string {
  switch (status) {
    case 'present':
      return 'Present';
    case 'check-in':
      return 'Checked In (Not Yet Present)';
    case 'late':
      return 'Late';
    case 'absent':
      return 'Absent';
    default:
      return status;
  }
}
