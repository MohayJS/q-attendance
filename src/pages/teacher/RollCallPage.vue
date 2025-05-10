<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { date, Dialog, Notify } from 'quasar';
import { ClassMeetingModel, MeetingCheckInModel } from 'src/models/attendance.models';
import { useAttendanceStore } from 'src/stores/attendance-store';
import { useClassStore } from 'src/stores/class-store';
import { useRoute, useRouter } from 'vue-router';
import { ClassModel } from 'src/models/class.models';
type StudentKey = string;
const route = useRoute();
const router = useRouter();
const attendanceStore = useAttendanceStore();
const classStore = useClassStore();

const currentClass = ref<ClassModel>();
const currentMeeting = ref<ClassMeetingModel>();
const studentCheckIns = ref<MeetingCheckInModel[]>([]);
const enrolledStudents = computed(() => currentClass.value?.enrolled || []);
const isSubmitting = ref(false);
const selectedStatuses = ref<Record<StudentKey, MeetingCheckInModel['status']>>({});
const activeClass = computed(() => {
  if (route.params?.classKey === currentClass.value?.key) {
    return currentClass.value;
  }
  return undefined;
});
onMounted(async () => {
  const meetingKey = route.params.meetingKey as string;
  const classKey = route.params.classKey as string;

  if (!meetingKey || !classKey) {
    Notify.create({
      message: 'Invalid meeting or class information',
      color: 'negative',
      icon: 'error',
      position: 'top',
      timeout: 3000,
    });
    void router.push({ name: 'teacherClass', params: { classKey } });
    return;
  }
  if (typeof classKey === 'string') {
    currentClass.value = await classStore.loadClass(classKey);
  }
  currentMeeting.value = await attendanceStore.loadMeeting(meetingKey);
  attendanceStore.streamCheckIns(meetingKey, (checkIns) => {
    studentCheckIns.value = checkIns;
    initializeSelectedStatuses();
  });
});

const initializeSelectedStatuses = () => {
  if (!currentMeeting.value) return;

  const statusMap: Record<StudentKey, MeetingCheckInModel['status']> = {};
  //assume everyone is absent first
  enrolledStudents.value.forEach((student) => {
    if (student.key) {
      statusMap[student.key] = 'absent';
    }
  });

  if (studentCheckIns.value.length) {
    studentCheckIns.value.forEach((checkIn) => {
      statusMap[checkIn.key] = checkIn.status;
    });
  }
  selectedStatuses.value = statusMap;
};
const studentsWithStatus = computed(() => {
  if (!currentMeeting.value) return [];

  return enrolledStudents.value.map((student) => {
    const studentKey = student.key || '';
    const checkIn = studentCheckIns.value.find((c) => c.key === studentKey);

    return {
      key: studentKey,
      name: student.fullName || 'Unknown Student',
      email: student.email || '',
      status: selectedStatuses.value[studentKey] || 'absent',
      checkInTime: checkIn?.checkInTime || '[NO CHECKED-IN]',
      checkInKey: checkIn?.key || student.key || '',
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
        color: 'primary',
      },
      cancel: {
        label: 'Cancel',
        flat: true,
      },
    }).onOk(() => {
      isSubmitting.value = true;

      const updatePromises = studentsWithStatus.value.map((student) => {
        const status = selectedStatuses.value[student.key];
        if (!status) return Promise.resolve();

        return attendanceStore.updateCheckInStatus({
          meetingKey: currentMeeting.value?.key || '',
          checkInKey: student.checkInKey,
          student: student.key,
          status: status,
        });
      });

      Promise.all(updatePromises)
        .then(async () => {
          Notify.create({
            message: 'Roll call submitted successfully',
            color: 'green',
            icon: 'check_circle',
            position: 'top',
            timeout: 3000,
          });

          await attendanceStore.concludeMeeting(currentMeeting.value?.key || '');

          void router.push({
            name: 'teacherClass',
            params: {
              classKey: route.params.classKey as string,
            },
          });
        })
        .catch((error) => {
          console.error('Error submitting roll call:', error);
          Notify.create({
            message: 'Failed to submit roll call',
            color: 'negative',
            icon: 'error',
            position: 'top',
            timeout: 3000,
          });
        });
    });
  } else {
    try {
      isSubmitting.value = true;

      const updatePromises = studentsWithStatus.value.map((student) => {
        const status = selectedStatuses.value[student.key];
        if (!status) return Promise.resolve();

        return attendanceStore.updateCheckInStatus({
          meetingKey: currentMeeting.value?.key || '',
          checkInKey: student.checkInKey,
          student: student.key,
          status: status,
        });
      });

      await Promise.all(updatePromises).then(async () => {
        Notify.create({
          message: 'Roll call saved',
          color: 'green',
          icon: 'check_circle',
          position: 'top',
          timeout: 3000,
        });
        await attendanceStore.latestCallMeeting(currentMeeting.value?.key || '');

        await router.push({
          name: 'teacherClass',
          params: {
            classKey: route.params.classKey as string,
          },
        });
      });
    } catch (error) {
      console.error('Error submitting roll call:', error);
      Notify.create({
        message: 'Failed to submit roll call',
        color: 'negative',
        icon: 'error',
        position: 'top',
        timeout: 3000,
      });
    }
  }
  isSubmitting.value = false;
}
function cancelRollCall() {
  void router.push({
    name: 'teacherClass',
    params: {
      classKey: route.params.classKey as string,
    },
  });
}
</script>

<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card v-if="currentMeeting">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Roll Call: {{ activeClass?.name }}</div>
          <div class="text-subtitle1">{{ formatDate(currentMeeting.date) }}</div>
          <q-badge
            :color="
              currentMeeting.status === 'open'
                ? 'green'
                : currentMeeting.status === 'cancelled'
                  ? 'red'
                  : 'blue'
            "
          >
            {{ currentMeeting.status }}
          </q-badge>
        </q-card-section>

        <q-card-section>
          <div class="text-h6 q-mb-md">Student Attendance</div>

          <q-table
            :rows="studentsWithStatus"
            :columns="[
              { name: 'name', label: 'Student Name', field: 'name', align: 'left', sortable: true },
              { name: 'checkInTime', label: 'Check-in Time', field: 'checkInTime', align: 'left' },
              { name: 'status', label: 'Status', field: 'status', align: 'center' },
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
                    { label: 'Absent', value: 'absent', color: 'red' },
                  ]"
                  @update:model-value="updateStudentStatus(props.row.key, $event)"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn color="negative" label="Cancel" :disable="isSubmitting" @click="cancelRollCall" />
          <q-btn color="orange" label="Save" :loading="isSubmitting" @click="saveRollCall(false)" />
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
