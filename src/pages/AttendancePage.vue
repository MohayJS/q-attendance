<script setup lang="ts">
import { uid } from 'quasar';
import { useClassStore } from 'src/stores/class-store';
import { useAttendanceStore } from 'src/stores/attendance-store';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const classStore = useClassStore();
const attendanceStore = useAttendanceStore();
const activeClass = computed(() => {
  if (typeof route.params?.classKey == 'string') {
    const classKey = route.params.classKey;
    return (classStore.classes || []).find((c) => c.key == classKey);
  } else {
    return {
      key: '',
      name: '',
    };
  }
});
const students = computed(() => {
  return attendanceStore.students || [];
});
type AttendanceStruct = {
  [studentKey: string]: boolean;
};
const attendance = ref<AttendanceStruct>({});
const showNewStudentDialog = ref(false);
const studentName = ref('');
function enrollStudent() {
  showNewStudentDialog.value = true;
}
function saveStudent() {
  const payload = {
    key: uid(),
    classKey: activeClass.value?.key || '',
    student: studentName.value,
  };
  attendanceStore.enrollNewStudent(payload);
  studentName.value = '';
  showNewStudentDialog.value = false;
}
</script>
<template>
  <q-page>
    <div class="q-pa-md">
      <q-toolbar>
        <q-toolbar-title>Attendance</q-toolbar-title>
        <q-btn icon="add" @click="enrollStudent()"></q-btn>
      </q-toolbar>
      <q-list bordered>
        <q-item v-for="item in students" :key="item.key" class="q-my-sm" clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">
              {{ item.student[0] }}
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ item.student }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-checkbox v-model="attendance[item.key]" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <q-page-sticky position="bottom" :offset="[0, 0]">
      <q-btn
        fab
        icon="shuffle"
        :to="{ name: 'rollCall', params: { classKey: route.params?.classKey } }"
        color="accent"
      >
        <span v-if="$q.screen.gt.sm">Shuffle</span>
        <q-tooltip v-else>Shuffle</q-tooltip>
      </q-btn>
    </q-page-sticky>
    <q-dialog position="standard" persistent v-model="showNewStudentDialog">
      <q-card>
        <q-form @submit="saveStudent()">
          <q-card-section>
            <q-input
              autofocus
              v-model="studentName"
              :rules="[
                (v) => (v && /^[a-z]/i.test(v)) || 'Should Start with a letter',
                (v) => (v && v.length > 3) || 'Should at least 4 characters',
              ]"
              placeholder="Student Name"
            />
          </q-card-section>
          <q-card-actions>
            <q-btn icon="cancel" color="secondary" v-close-popup>Cancel</q-btn>
            <q-btn icon="save" type="submit">Save</q-btn>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>
