<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { date, Dialog, Notify } from 'quasar';
import { ClassMeetingModel, MeetingCheckInModel } from 'src/models/attendance.models';
import { useAttendanceStore } from 'src/stores/attendance-store';
import { useClassStore } from 'src/stores/class-store';
import { useUsersStore } from 'src/stores/user-store';
import { UserModel } from 'src/models/user.models';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const attendanceStore = useAttendanceStore();
const classStore = useClassStore();
const usersStore = useUsersStore();

const meeting = ref<ClassMeetingModel | null>(null);
const enrolledStudents = ref<UserModel[]>([]);
const isSubmitting = ref(false);
const selectedStatuses = ref<Record<string, MeetingCheckInModel['status']>>({});
onMounted(async () => {
  const meetingKey = route.params.meetingKey as string;
  const classKey = route.params.classKey as string;

  if (!meetingKey || !classKey) {
    Notify.create({
      message: 'Invalid meeting or class information',
      color: 'negative',
      icon: 'error',
      position: 'top',
      timeout: 3000
    });
    void router.push({ name: 'teacherClass', params: { classKey } });
    return;
  }

  await loadMeetingData(meetingKey, classKey);

  await loadEnrolledStudents(classKey);

  initializeSelectedStatuses();
});

async function loadMeetingData(meetingKey: string, classKey: string) {
  const meetings = await attendanceStore.loadClassMeetings(classKey);
  const foundMeeting = meetings.find(m => m.key === meetingKey);

  if (!foundMeeting) {
    Notify.create({
      message: 'Meeting not found',
      color: 'negative',
      icon: 'error',
      position: 'top',
      timeout: 3000
    });
    void router.push({ name: 'teacherClass', params: { classKey } });
    return;
  }

  meeting.value = foundMeeting;

  if (meeting.value.status !== 'open') {
    Notify.create({
      message: 'Roll call can only be performed for open attendance sessions',
      color: 'negative',
      icon: 'error',
      position: 'top',
      timeout: 3000
    });
    void router.push({ name: 'teacherClass', params: { classKey } });
  }
}

async function loadEnrolledStudents(classKey: string) {
  if (!classStore.classes.some(c => c.key === classKey)) {
    await classStore.loadClass(classKey);
  }

  const activeClass = classStore.classes.find(c => c.key === classKey);

  if (!activeClass?.enrolledStudents?.length) {
    enrolledStudents.value = [];
    return;
  }

  if (usersStore.users.length === 0) {
    await usersStore.loadUsers();
  }

  enrolledStudents.value = usersStore.users.filter(user =>
    activeClass.enrolledStudents?.includes(user.key || '')
  );
}
const initializeSelectedStatuses = () => {
  if (!meeting.value) return;

  const statusMap: Record<string, MeetingCheckInModel['status']> = {};

  enrolledStudents.value.forEach(student => {
    if (student.key) {
      statusMap[student.key] = 'absent';
    }
  });

  if (meeting.value.checkIns) {
    meeting.value.checkIns.forEach(checkIn => {
      statusMap[checkIn.student] = checkIn.status;
    });
  }

  selectedStatuses.value = statusMap;
};
const studentsWithStatus = computed(() => {
  if (!meeting.value) return [];

  return enrolledStudents.value.map(student => {
    const studentKey = student.key || '';
    const checkIn = meeting.value?.checkIns?.find(c => c.student === studentKey);

    return {
      key: studentKey,
      name: student.fullName || 'Unknown Student',
      email: student.email || '',
      status: selectedStatuses.value[studentKey] || 'absent',
      checkInTime: checkIn?.checkInTime || '-',
      checkInKey: checkIn?.key || ''
    };
  });
});
function formatDate(dateString: string) {
  try {
    return date.formatDate(dateString, 'MMMM D, YYYY - HH:mm');
  } catch {
    return dateString;
  }
}
function updateStudentStatus(studentKey: string, status: MeetingCheckInModel['status']) {
  selectedStatuses.value[studentKey] = status;
}
async function saveRollCall(isSubmit: boolean = false) {
  if (isSubmit) {
    Dialog.create({
      title: 'Submit Roll Call',
      message: 'Are you sure you want to submit this roll call?',
      persistent: true,
      ok: {
        label: 'Yes, Submit',
        color: 'primary'
      },
      cancel: {
        label: 'Cancel',
        flat: true
      }
    }).onOk(() => {
      isSubmitting.value = true;

      const updatePromises = studentsWithStatus.value.map(student => {
        const status = selectedStatuses.value[student.key];
        if (!status) return Promise.resolve(); 

        return attendanceStore.updateCheckInStatus({
          meetingKey: meeting.value?.key || '',
          checkInKey: student.checkInKey,
          student: student.key,
          status: status
        });
      });

      Promise.all(updatePromises)
        .then(async () => {
          Notify.create({
            message: 'Roll call submitted successfully',
            color: 'green',
            icon: 'check_circle',
            position: 'top',
            timeout: 3000
          });

          await attendanceStore.concludeMeeting(meeting.value?.key || '');

          void router.push({
            name: 'teacherClass',
            params: {
              classKey: route.params.classKey as string
            }
          });
        })
        .catch((error) => {
          console.error('Error submitting roll call:', error);
          Notify.create({
            message: 'Failed to submit roll call',
            color: 'negative',
            icon: 'error',
            position: 'top',
            timeout: 3000
          });
        })
    });
  } else {
    try {
      isSubmitting.value = true;

      const updatePromises = studentsWithStatus.value.map(student => {
        const status = selectedStatuses.value[student.key];
        if (!status) return Promise.resolve(); 

        return attendanceStore.updateCheckInStatus({
          meetingKey: meeting.value?.key || '',
          checkInKey: student.checkInKey,
          student: student.key,
          status: status
        });
      });

      await Promise.all(updatePromises)
        .then(() => {


          Notify.create({
            message: 'Roll call saved',
            color: 'green',
            icon: 'check_circle',
            position: 'top',
            timeout: 3000
          });

          void router.push({
            name: 'teacherClass',
            params: {
              classKey: route.params.classKey as string
            }
          });
        })
    } catch (error) {
      console.error('Error submitting roll call:', error);
      Notify.create({
        message: 'Failed to submit roll call',
        color: 'negative',
        icon: 'error',
        position: 'top',
        timeout: 3000
      });
    } 
  }
  isSubmitting.value = false;
}
function cancelRollCall() {
  void router.push({
    name: 'teacherClass',
    params: {
      classKey: route.params.classKey as string
    }
  });
}
</script>

<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card v-if="meeting">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Roll Call</div>
          <div class="text-subtitle1">{{ formatDate(meeting.date) }}</div>
          <q-badge :color="meeting.status === 'open' ? 'green' : meeting.status === 'cancelled' ? 'red' : 'blue'">
            {{ meeting.status }}
          </q-badge>
        </q-card-section>

        <q-card-section>
          <div class="text-h6 q-mb-md">Student Attendance</div>

          <q-table
            :rows="studentsWithStatus"
            :columns="[
              { name: 'name', label: 'Student Name', field: 'name', align: 'left', sortable: true },
              { name: 'checkInTime', label: 'Check-in Time', field: 'checkInTime', align: 'left' },
              { name: 'status', label: 'Status', field: 'status', align: 'center' }
            ]"
            row-key="key"
            :pagination="{ rowsPerPage: 0 }"
          >
            <template v-slot:body-cell-status="props">
              <q-td :props="props" class="q-gutter-sm">
                <q-btn-toggle
                  v-model="selectedStatuses[props.row.key]"
                  toggle-color="primary"
                  :options="[
                    { label: 'Present', value: 'present', color: 'green' },
                    { label: 'Late', value: 'late', color: 'orange' },
                    { label: 'Absent', value: 'absent', color: 'red' }
                  ]"
                  @update:model-value="updateStudentStatus(props.row.key, $event)"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            color="negative"
            label="Cancel"
            :disable="isSubmitting"
            @click="cancelRollCall"
          />
          <q-btn
            color="orange"
            label="Save"
            :loading="isSubmitting"
            @click="saveRollCall(false)"
          />
          <q-btn
            color="primary"
            label="Submit Roll Call"
            :loading="isSubmitting"
            @click="saveRollCall(true)"
          />
        </q-card-actions>
      </q-card>

      <div v-else class="text-center q-pa-xl">
        <q-spinner-dots color="primary" size="40px" />
        <div class="q-mt-md">Loading roll call data...</div>
      </div>
    </div>
  </q-page>
</template>
