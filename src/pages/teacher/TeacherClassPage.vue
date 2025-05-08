<script setup lang="ts">
import { useClassStore } from 'src/stores/class-store';
import { useAttendanceStore } from 'src/stores/attendance-store';
import { useUsersStore } from 'src/stores/user-store';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { UserModel } from 'src/models/user.models';
import { uid, QTableColumn, Notify } from 'quasar';
import { ClassMeetingModel } from 'src/models/attendance.models';
import AttendanceDetailsDialog from 'src/components/AttendanceDetailsDialog.vue';

const route = useRoute();
const router = useRouter();
const classStore = useClassStore();
const attendanceStore = useAttendanceStore();
const usersStore = useUsersStore();

const tab = ref('students');

const activeClass = computed(() => {
  if (typeof route.params?.classKey === 'string') {
    const classKey = route.params.classKey;
    return (classStore.classes || []).find((c) => c.key === classKey);
  }
  return undefined;
});

const enrolledStudents = ref<UserModel[]>([]);
const showNewStudentDialog = ref(false);
const studentName = ref('');
const studentEmail = ref('');

const attendanceHistory = ref<ClassMeetingModel[]>([]);
const selectedMeeting = ref<ClassMeetingModel | null>(null);
const showAttendanceDetails = ref(false);
const attendanceColumns: QTableColumn[] = [
  {
    name: 'date',
    required: true,
    label: 'Date',
    align: 'left',
    field: 'date',
    sortable: true
  },
  {
    name: 'status',
    align: 'center',
    label: 'Status',
    field: 'status',
    sortable: true
  },
  {
    name: 'present',
    align: 'center',
    label: 'Present',
    field: (row: ClassMeetingModel) => row.checkIns?.filter(c => c.status === 'present' || c.status === 'check-in').length || 0,
    sortable: true
  },
  {
    name: 'late',
    align: 'center',
    label: 'Late',
    field: (row: ClassMeetingModel) => row.checkIns?.filter(c => c.status === 'late').length || 0,
    sortable: true
  },
  {
    name: 'absent',
    align: 'center',
    label: 'Absent',
    field: (row: ClassMeetingModel) => row.checkIns?.filter(c => c.status === 'absent').length || 0,
    sortable: true
  },
  {
    name: 'actions',
    align: 'right',
    label: 'Actions',
    field: 'actions',
    sortable: false
  }
];

onMounted(async () => {
  if (typeof route.params?.classKey === 'string') {
    await classStore.loadClass(route.params.classKey);
    await loadEnrolledStudents();
    await loadAttendanceHistory();
  }
});

async function loadEnrolledStudents() {
  if (!activeClass.value?.enrolledStudents?.length) {
    enrolledStudents.value = [];
    return;
  }

  if (usersStore.users.length === 0) {
    await usersStore.loadUsers();
  }

  enrolledStudents.value = usersStore.users.filter(user =>
    activeClass.value?.enrolledStudents?.includes(user.key || '')
  );
}

async function loadAttendanceHistory() {
  if (activeClass.value?.key) {
    attendanceHistory.value = await attendanceStore.loadClassMeetings(activeClass.value.key);
  } else {
    attendanceHistory.value = [];
  }
}

function enrollStudent() {
  showNewStudentDialog.value = true;
  studentName.value = '';
  studentEmail.value = '';
}

async function saveStudent() {
  if (activeClass.value) {
    await classStore.enroll({
      class: activeClass.value,
      student: {
        key: uid(),
        email: studentEmail.value,
        fullName: studentName.value,
      },
    });

    await loadEnrolledStudents();
  }

  showNewStudentDialog.value = false;
}

async function removeStudent(student: UserModel) {
  if (activeClass.value && student.key) {
    const result = await classStore.unenroll({
      classKey: activeClass.value.key || '',
      studentKey: student.key
    });

    if (result) {
      await loadEnrolledStudents();
    }
  }
}

function viewAttendanceDetails(meeting: ClassMeetingModel) {
  selectedMeeting.value = meeting;
  showAttendanceDetails.value = true;
}

function startRollCall(meeting: ClassMeetingModel) {
  if (meeting.status !== 'open') {
    Notify.create({
      message: 'Roll call can only be performed for open attendance sessions',
      color: 'negative',
      icon: 'error',
      position: 'top',
      timeout: 3000
    });
    return;
  }

  void router.push({
    name: 'rollCall',
    params: {
      classKey: route.params.classKey as string,
      meetingKey: meeting.key
    }
  });
}

async function handleAttendanceUpdated() {
  if (activeClass.value?.key) {
    await loadAttendanceHistory();
  }
}
</script>

<template>
  <q-page style="margin: 2rem 1rem 2rem 1.5rem;">
    <div class="class-dashboard q-mb-md" v-if="activeClass">
      <q-card>
        <q-card-section>
          <div class="text-h5">{{ activeClass.name }}</div>
          <div class="text-subtitle2">Section: {{ activeClass.section }} | Academic Year: {{ activeClass.academicYear }}</div>
          <div class="text-caption">Class Code: {{ activeClass.classCode }}</div>
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-card class="bg-white text-primary">
                <q-card-section class="text-center">
                  <div class="text-h6">{{ enrolledStudents.length }}</div>
                  <div class="text-subtitle2">Enrolled Students</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-4">
              <q-card class="bg-white text-primary">
                <q-card-section class="text-center">
                  <div class="text-h6">{{ attendanceHistory.length }}</div>
                  <div class="text-subtitle2">Attendance Sessions</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-4">
              <q-card class="bg-white text-primary">
                <q-card-section class="text-center">
                  <div class="text-h6">0%</div>
                  <div class="text-subtitle2">Average Attendance</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <q-tabs
      v-model="tab"
      class="text-primary"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="students" label="Students" icon="people" />
      <q-tab name="attendance" label="Attendance History" icon="history" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="students">
        <div class="q-mb-md flex justify-between items-center">
          <div class="text-h6">Enrolled Students</div>
          <q-btn color="primary" disabled icon="person_add" label="Add Student" @click="enrollStudent" />
        </div>

        <q-list bordered separator>
          <q-item v-for="student in enrolledStudents" :key="String(student.key)" class="q-my-sm">
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white">
                {{ student.fullName ? student.fullName[0] : 'S' }}
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ student.fullName }}</q-item-label>
              <q-item-label caption>{{ student.email }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn color="red" icon="delete" dense round @click="removeStudent(student)">
                <q-tooltip>Remove Student</q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>

          <q-item v-if="enrolledStudents.length === 0">
            <q-item-section>
              <q-item-label class="text-center text-grey">No students enrolled yet</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>

      <q-tab-panel name="attendance">
        <div class="q-mb-md flex justify-between items-center">
          <div class="text-h6">Attendance History</div>
          <q-btn color="primary" icon="add" label="New Attendance" :to="{ name: 'createAttendance', params: { classKey: route.params?.classKey } }" />
        </div>

        <q-table
          :rows="attendanceHistory"
          :columns="attendanceColumns"
          row-key="key"
          :rows-per-page-options="[30, 40, 50]"
          v-if="attendanceHistory.length > 0"
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="props.row.status === 'open' ? 'green' : props.row.status === 'cancelled' ? 'red' : 'blue'">
                {{ props.row.status }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <div>
                <q-btn
                  v-if="props.row.status === 'open'"
                  color="green"
                  icon="how_to_reg"
                  dense
                  round
                  @click="startRollCall(props.row)"
                >
                  <q-tooltip>Start Roll Call</q-tooltip>
                </q-btn>
                <q-btn v-else color="primary" icon="visibility" dense round @click="viewAttendanceDetails(props.row)">
                  <q-tooltip>View Details</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>
        </q-table>

        <div v-else class="text-center q-pa-lg text-grey">
          No attendance records found
        </div>
      </q-tab-panel>
    </q-tab-panels>

    <q-dialog v-model="showNewStudentDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Add New Student</div>
        </q-card-section>

        <q-form @submit="saveStudent">
          <q-card-section>
            <q-input
              v-model="studentName"
              label="Student Name"
              :rules="[
                v => !!v || 'Name is required',
                v => v.length >= 3 || 'Name must be at least 3 characters'
              ]"
            />
            <q-input
              v-model="studentEmail"
              label="Student Email"
              type="email"
              :rules="[
                v => !!v || 'Email is required',
                v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Please enter a valid email'
              ]"
            />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="negative" v-close-popup />
            <q-btn flat type="submit" label="Add" color="positive" :disable="!studentName || !studentEmail" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- Attendance Details Dialog -->
    <attendance-details-dialog
      v-if="selectedMeeting"
      :meeting="selectedMeeting"
      v-model:show="showAttendanceDetails"
      @attendance-updated="handleAttendanceUpdated"
    />
  </q-page>
</template>

<style scoped>
.class-dashboard {
  border-radius: 8px;
  overflow: hidden;
}
</style>