<script setup lang="ts">
import { date, uid } from 'quasar';
import { useClassStore } from 'src/stores/class-store';
import { useAuthStore } from 'src/stores/auth-store';
import { computed, onMounted, ref } from 'vue';
import { ClassModel } from 'src/models/class.models';
import { useRouter } from 'vue-router';

const classStore = useClassStore();
const authStore = useAuthStore();
const router = useRouter();

const showNewClassDialog = ref(false);
const className = ref('');
const classSection = ref('');

const teacherClasses = computed(() => {
  return classStore.teaching;
});

onMounted(async () => {
  await classStore.loadUserClasses(authStore.currentAccount?.key || '');
});

function addNewClass() {
  showNewClassDialog.value = true;
}

async function saveClass() {
  if (authStore.currentAccount) {
    const newClass: ClassModel = {
      key: uid(),
      name: className.value,
      academicYear: date.formatDate(new Date(), 'YYYY'),
      classCode: Math.random().toString(36).substring(2, 6).toUpperCase(),
      section: classSection.value,
    };
    await classStore.saveClass(newClass, authStore.currentAccount);
  }

  className.value = '';
  showNewClassDialog.value = false;
}

async function deleteCourse(cls: ClassModel) {
  await classStore.deleteClass(cls.key || '');
}

function navigateToClass(cls: ClassModel) {
  void router.push({ name: 'teacherClass', params: { classKey: cls.key } });
}
</script>

<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">{{ teacherClasses.length }}</div>
            <div class="text-subtitle2">Classes</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">
              {{ teacherClasses.reduce((sum, cls) => sum + (cls.enrolled?.length || 0), 0) }}
            </div>
            <div class="text-subtitle2">Students</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">0</div>
            <div class="text-subtitle2">Today's Attendance</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">0%</div>
            <div class="text-subtitle2">Attendance Rate</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">My Classes</div>
          </q-card-section>

          <q-list bordered separator>
            <q-item
              v-for="theClass in teacherClasses"
              :key="String(theClass.key)"
              clickable
              v-ripple
              @click="navigateToClass(theClass)"
            >
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">
                  {{ theClass.name[0] }}
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ theClass.name }} - {{ theClass.section }}</q-item-label>
                <q-item-label caption
                  >{{ theClass.academicYear }} • {{ theClass.classCode }}</q-item-label
                >
              </q-item-section>

              <q-item-section side>
                <!-- <q-badge color="primary">{{ theClass.enrolled?.length || 0 }} students</q-badge> -->
                <q-btn color="red" icon="delete" dense round @click.stop="deleteCourse(theClass)">
                  <q-tooltip>Delete</q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>

            <q-item v-if="teacherClasses.length === 0">
              <q-item-section>
                <q-item-label class="text-center text-grey">No classes yet</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="accent" @click="addNewClass()" />
    </q-page-sticky>

    <q-dialog v-model="showNewClassDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">New Class</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="className"
            label="Class Name"
            :rules="[
              (v) => !!v || 'Class name is required',
              (v) => v.length >= 3 || 'Name must be at least 3 characters',
            ]"
          />
          <q-input
            v-model="classSection"
            label="Class Section"
            :rules="[(v) => !!v || 'Class section is required']"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="negative" v-close-popup />
          <q-btn flat label="Create" color="positive" @click="saveClass" :disable="!className" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style scoped>
.dashboard-card {
  background-color: white;
  border-radius: 10px;
  border: solid 0.5px rgb(224, 224, 224);
}
</style>
