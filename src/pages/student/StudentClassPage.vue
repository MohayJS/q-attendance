<script setup lang="ts">
import { useClassStore } from 'src/stores/class-store';
import { useAttendanceStore } from 'src/stores/attendance-store';
import { useAuthStore } from 'src/stores/auth-store';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { date, Notify } from 'quasar';
import { ClassMeetingModel, MeetingCheckInModel } from 'src/models/attendance.models';


interface StudentAttendanceRecord extends MeetingCheckInModel {
  date?: string;
}

const route = useRoute();
const classStore = useClassStore();
const attendanceStore = useAttendanceStore();
const authStore = useAuthStore();

const tab = ref('check-in');
const isCheckingIn = ref(false);
const studentAttendanceHistory = ref<StudentAttendanceRecord[]>([]);


const activeClass = computed(() => {
  if (typeof route.params?.classKey === 'string') {
    const classKey = route.params.classKey;
    return (classStore.classes || []).find((c) => c.key === classKey);
  }
  return undefined;
});


const currentStudent = computed(() => {
  return authStore.currentAccount;
});


const openAttendanceSessions = computed(() => {
  return attendanceStore.meetings.filter(meeting => {

    if (meeting.status !== 'open') return false;
    
    if (meeting.checkIns && meeting.checkIns.some(checkIn =>
      checkIn.student === currentStudent.value?.key
    )) {
      return false;
    }

    return true;
  });
});




onMounted(async () => {
  if (typeof route.params?.classKey === 'string') {
    await classStore.loadClass(route.params.classKey);
    await loadAttendanceSessions();
  }
});


async function loadAttendanceSessions() {
  if (activeClass.value?.key) {
    await attendanceStore.loadClassMeetings(activeClass.value.key);
    loadStudentAttendanceHistory();
  }
}


function loadStudentAttendanceHistory() {
  if (!currentStudent.value?.key || !activeClass.value?.key) return;
  const history: StudentAttendanceRecord[] = [];
  
  attendanceStore.meetings.forEach(meeting => {
    const studentCheckIn = meeting.checkIns?.find(
      checkIn => checkIn.student === currentStudent.value?.key
    );

    if (studentCheckIn) {
      history.push({
        ...studentCheckIn,
        
        date: meeting.date
      });
    } else if (meeting.status === 'concluded') {
      
      history.push({
        key: '',
        student: currentStudent.value?.key || '',
        checkInTime: '-',
        status: 'absent',
        date: meeting.date
      });
    }
  });
  studentAttendanceHistory.value = history;
}

async function checkInToSession(meeting: ClassMeetingModel) {
  if (!currentStudent.value?.key) {
    Notify.create({
      message: 'You must be logged in to check in',
      color: 'negative',
      icon: 'error',
      position: 'top',
      timeout: 3000
    });
    return;
  }

  const canCheckIn = validateCheckInTime(meeting.date);
  if (!canCheckIn.valid) {
    Notify.create({
      message: canCheckIn.message,
      color: 'red',
      icon: 'error',
      position: 'top',
      timeout: 3000
    });
    return;
  }

  isCheckingIn.value = true;
  try {
    await attendanceStore.checkInAttendance({
      student: currentStudent.value.key,
      meeting: meeting,
      status: 'check-in' 
    });

    Notify.create({
      message: 'Successfully checked in to class. Your status is "Checked In (Not Yet Present)" until the teacher confirms your attendance.',
      color: 'positive',
      icon: 'check_circle',
      position: 'top',
      timeout: 5000
    });

    await loadAttendanceSessions();
  } catch (error) {
    console.error('Error checking in:', error);
    Notify.create({
      message: 'Failed to check in',
      color: 'negative',
      icon: 'error',
      position: 'top',
      timeout: 3000
    });
  } finally {
    isCheckingIn.value = false;
  }
}

function validateCheckInTime(classDateString: string): { valid: boolean; message: string } {
  try {    
    const classDateTime = new Date(classDateString);
    const currentTime = new Date();
    
    if (currentTime > classDateTime) {
      const graceEndTime = new Date(classDateTime.getTime() + 30 * 60 * 1000);

      if (currentTime <= graceEndTime) {
        return { valid: true, message: '' };
      }

      return {
        valid: false,
        message: 'Check-in is only available before or within 30 minutes of the scheduled class time.'
      };
    }

    return { valid: true, message: '' };
  } catch (error) {
    console.error('Error validating check-in time:', error);
    return {
      valid: false,
      message: 'Unable to validate check-in time. Please try again.'
    };
  }
}


function formatDate(dateString: string | undefined) {
  if (!dateString) return 'Unknown date';

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
</script>

<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">{{ activeClass?.name || 'Class' }}</div>
          <div v-if="activeClass" class="text-subtitle2">
            Section: {{ activeClass.section }}
          </div>
        </q-card-section>
      </q-card>

      <q-tabs
        v-model="tab"
        class="text-primary"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="check-in" label="Check-in" icon="how_to_reg" />
        <q-tab name="history" label="Attendance History" icon="history" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <!-- Check-in Tab -->
        <q-tab-panel name="check-in">
          <div class="text-h6 q-mb-md">Available Check-ins</div>

          <div v-if="openAttendanceSessions.length === 0" class="text-center q-pa-lg text-grey">
            No open attendance sessions available.
          </div>

          <q-list v-else bordered separator>
            <q-item v-for="session in openAttendanceSessions" :key="session.key" class="q-my-sm">
              <q-item-section>
                <q-item-label>{{ formatDate(session.date) }}</q-item-label>
                <q-item-label caption>
                  Status: <q-badge color="green">{{ session.status }}</q-badge>
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-btn
                  color="primary"
                  label="Check-in"
                  :loading="isCheckingIn"
                  @click="checkInToSession(session)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <!-- Attendance History Tab -->
        <q-tab-panel name="history">
          <div class="text-h6 q-mb-md">My Attendance History</div>

          <div v-if="studentAttendanceHistory.length === 0" class="text-center q-pa-lg text-grey">
            No attendance records found.
          </div>

          <q-list v-else bordered separator>
            <q-item v-for="record in studentAttendanceHistory" :key="record.key" class="q-my-sm">
              <q-item-section>
                <q-item-label>{{ formatDate(record.date) }}</q-item-label>
                <q-item-label caption>
                  Check-in time: {{ record.checkInTime }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-badge :color="getStatusColor(record.status)">
                  {{ getStatusLabel(record.status) }}
                </q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>
