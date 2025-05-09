<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { date, Dialog, Notify } from 'quasar';
import { ClassMeetingModel, MeetingCheckInModel } from 'src/models/attendance.models';
import { useUsersStore } from 'src/stores/user-store';
import { useAttendanceStore } from 'src/stores/attendance-store';
import { useClassStore } from 'src/stores/class-store';

const props = defineProps<{
  meeting: ClassMeetingModel;
  show: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
  (e: 'attendance-updated'): void;
}>();

const usersStore = useUsersStore();
const attendanceStore = useAttendanceStore();
const classStore = useClassStore();

const isUpdating = ref(false);
const enrolledStudentIds = ref<string[]>([]);

onMounted(async () => {
  if (props.meeting.classKey) {
    const existingClass = classStore.teaching.find((c) => c.key === props.meeting.classKey);
    if (!existingClass) {
      await classStore.loadClass(props.meeting.classKey);
    }

    const classData = classStore.teaching.find((c) => c.key === props.meeting.classKey);
    if (classData?.enrolled) {
      enrolledStudentIds.value = classData.enrolled.map((e) => e.key!);
    }
  }
});

const checkInsWithStudentNames = computed(() => {
  if (!props.meeting.checkIns) return [];

  return props.meeting.checkIns.map((checkIn) => {
    const student = usersStore.users.find((user) => user.key === checkIn.student);
    return {
      ...checkIn,
      studentName: student?.fullName || 'Unknown Student',
    };
  });
});

const absentStudents = computed(() => {
  if (!props.meeting.checkIns || enrolledStudentIds.value.length === 0) return [];

  const checkedInStudentIds = props.meeting.checkIns.map((checkIn) => checkIn.student);

  return usersStore.users
    .filter(
      (user) =>
        enrolledStudentIds.value.includes(user.key || '') &&
        !checkedInStudentIds.includes(user.key || '') &&
        user.role === 'student',
    )
    .map((student) => ({
      key: '',
      student: student.key || '',
      studentName: student.fullName || 'Unknown Student',
      checkInTime: '-',
      status: 'absent' as MeetingCheckInModel['status'],
    }));
});

function formatDate(dateString: string) {
  try {
    return date.formatDate(dateString, 'MMMM D, YYYY - HH:mm');
  } catch {
    return dateString;
  }
}

function getStatusColor(status: MeetingCheckInModel['status']): string {
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

function getStatusLabel(status: MeetingCheckInModel['status']): string {
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

function closeAttendanceSession() {
  Dialog.create({
    title: 'Close Attendance Session',
    message:
      'Are you sure you want to close this attendance session? This will mark all students who have not checked in as absent.',
    persistent: true,
    ok: {
      label: 'Yes, Close Session',
      color: 'primary',
    },
    cancel: {
      label: 'Cancel',
      flat: true,
    },
  }).onOk(() => {
    try {
      isUpdating.value = true;

      attendanceStore
        .concludeMeeting(props.meeting.key)
        .then(() => {
          Notify.create({
            message: 'Attendance session closed successfully',
            color: 'green',
            icon: 'check_circle',
            position: 'top',
            timeout: 3000,
          });

          emit('attendance-updated');

          emit('update:show', false);
        })
        .catch((error) => {
          console.error('Error closing attendance session:', error);
          Notify.create({
            message: 'Failed to close attendance session',
            color: 'negative',
            icon: 'error',
            position: 'top',
            timeout: 3000,
          });
        })
        .finally(() => {
          isUpdating.value = false;
        });
    } catch (error) {
      console.error('Error initiating close attendance session:', error);
      isUpdating.value = false;
    }
  });
}

function reopenAttendanceSession() {
  Dialog.create({
    title: 'Re-open Attendance Session',
    message: 'Are you sure you want to re-open this attendance session?',
    persistent: true,
    ok: {
      label: 'Yes, Re-open Session',
      color: 'primary',
    },
    cancel: {
      label: 'Cancel',
      flat: true,
    },
  }).onOk(() => {
    try {
      isUpdating.value = true;

      attendanceStore
        .reopenMeeting(props.meeting.key)
        .then(() => {
          Notify.create({
            message: 'Attendance session re-opened successfully',
            color: 'green',
            icon: 'check_circle',
            position: 'top',
            timeout: 3000,
          });

          emit('attendance-updated');

          emit('update:show', false);
        })
        .catch((error) => {
          console.error('Error re-opening attendance session:', error);
          Notify.create({
            message: 'Failed to re-open attendance session',
            color: 'negative',
            icon: 'error',
            position: 'top',
            timeout: 3000,
          });
        })
        .finally(() => {
          isUpdating.value = false;
        });
    } catch (error) {
      console.error('Error initiating re-open attendance session:', error);
      isUpdating.value = false;
    }
  });
}
</script>

<template>
  <q-dialog
    :model-value="show"
    @update:model-value="emit('update:show', $event)"
    persistent
    maximized
  >
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Attendance Details</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <div class="text-subtitle1">{{ formatDate(meeting.date) }}</div>
        <q-badge
          :color="
            meeting.status === 'open' ? 'green' : meeting.status === 'cancelled' ? 'red' : 'blue'
          "
        >
          {{ meeting.status }}
        </q-badge>
      </q-card-section>

      <q-card-section>
        <div class="text-h6 q-mb-md">Student Attendance</div>

        <q-list bordered separator>
          <q-item v-for="checkIn in checkInsWithStudentNames" :key="checkIn.key" class="q-my-sm">
            <q-item-section>
              <q-item-label>{{ checkIn.studentName }}</q-item-label>
              <q-item-label caption> Check-in time: {{ checkIn.checkInTime }} </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-badge :color="getStatusColor(checkIn.status)">
                {{ getStatusLabel(checkIn.status) }}
              </q-badge>
            </q-item-section>
          </q-item>

          <q-item v-for="student in absentStudents" :key="student.student" class="q-my-sm">
            <q-item-section>
              <q-item-label>{{ student.studentName }}</q-item-label>
              <q-item-label caption> Not checked in </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-badge color="red"> Not Checked In </q-badge>
            </q-item-section>
          </q-item>

          <q-item v-if="checkInsWithStudentNames.length === 0 && absentStudents.length === 0">
            <q-item-section>
              <q-item-label class="text-center text-grey"
                >No attendance data available</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          v-if="meeting.status === 'open'"
          color="primary"
          label="Close Attendance Session"
          :loading="isUpdating"
          @click="closeAttendanceSession"
        />
        <q-btn
          v-if="meeting.status === 'concluded'"
          color="primary"
          label="Re-open Attendance Session"
          :loading="isUpdating"
          @click="reopenAttendanceSession"
        />
        <q-btn flat label="Close" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
