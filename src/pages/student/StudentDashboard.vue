<script setup lang="ts">
import { useClassStore } from 'src/stores/class-store';
import { useAuthStore } from 'src/stores/auth-store';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Notify, Dialog } from 'quasar';
import { ClassModel } from 'src/models/class.models';

const classStore = useClassStore();
const authStore = useAuthStore();
const router = useRouter();

const showEnrollDialog = ref(false);
const classCode = ref('');
const isLoading = ref(false);
const codeError = ref('');

const studentClasses = computed(() => {
  return classStore.classes;
});

const handleEnrollDialog = () => {
  openEnrollDialog();
};

onMounted(async () => {
  await loadStudentClasses();

  window.addEventListener('open-enroll-dialog', handleEnrollDialog);
});

onUnmounted(() => {
  window.removeEventListener('open-enroll-dialog', handleEnrollDialog);
});

async function loadStudentClasses() {
  if (authStore.currentAccount?.key) {
    await classStore.loadClassesByStudent(authStore.currentAccount.key);
  }
}

function openEnrollDialog() {
  showEnrollDialog.value = true;
  classCode.value = '';
  codeError.value = '';
}

async function enrollInClass() {
  if (!classCode.value) {
    codeError.value = 'Please enter a class code';
    return;
  }

  isLoading.value = true;
  codeError.value = '';

  try {
    const foundClass = await classStore.findClassByCode(classCode.value);

    if (!foundClass) {
      codeError.value = 'Invalid class code. Please check and try again.';
      isLoading.value = false;
      return;
    }

    if (authStore.currentAccount?.key && foundClass.enrolledStudents?.includes(authStore.currentAccount.key)) {
      codeError.value = 'You are already enrolled in this class.';
      isLoading.value = false;
      return;
    }

    if (authStore.currentAccount) {
      await classStore.enroll({
        class: foundClass,
        student: authStore.currentAccount
      });

      Notify.create({
        message: `Successfully enrolled in ${foundClass.name}`,
        color: 'green',
        icon: 'check_circle',
        position: 'top',
        timeout: 3000
      });

      await loadStudentClasses();

      showEnrollDialog.value = false;
    }
  } catch (error) {
    console.error('Error enrolling in class:', error);
    codeError.value = 'An error occurred. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

function navigateToClass(cls: { key?: string }) {
  void router.push({ name: 'studentClass', params: { classKey: cls.key } });
}

async function unenrollCourse(cls: ClassModel) {
  if (!cls.key || !authStore.currentAccount?.key) {
    return;
  }

  try {
    await new Promise<void>((resolve, reject) => {
      Dialog.create({
        title: 'Confirm Unenrollment',
        message: `Are you sure you want to unenroll from ${cls.name}?`,
        persistent: true,
        color: 'primary',
        ok: {
          label: 'Confirm',
          color: 'negative',
          unelevated: true
        },
        cancel: {
          label: 'Cancel',
          color: 'grey',
          flat: true
        }
      }).onOk(() => {
        resolve();
      }).onCancel(() => {
        reject(new Error('Cancelled'));
      }).onDismiss(() => {
        reject(new Error('Dismissed'));
      });
    });
  } catch {
    return;
  }

  try {
    const success = await classStore.unenroll({
      classKey: cls.key,
      studentKey: authStore.currentAccount.key
    });

    if (success) {
      Notify.create({
        message: `Successfully unenrolled from ${cls.name}`,
        color: 'green',
        icon: 'check_circle',
        position: 'top',
        timeout: 3000
      });

      await loadStudentClasses();
    } else {
      Notify.create({
        message: 'Failed to unenroll from class',
        color: 'negative',
        icon: 'error',
        position: 'top',
        timeout: 3000
      });
    }
  } catch (error) {
    console.error('Error unenrolling from class:', error);
    Notify.create({
      message: 'An error occurred while unenrolling',
      color: 'negative',
      icon: 'error',
      position: 'top',
      timeout: 3000
    });
  }
}
</script>

<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">My Classes</div>
          </q-card-section>

          <q-list bordered separator>
            <q-item
              v-for="theClass in studentClasses"
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
                <q-item-label caption>{{ theClass.academicYear }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-btn color="red" icon="delete" dense round @click.stop="unenrollCourse(theClass)">
                  <q-tooltip>Unenroll</q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>

            <q-item v-if="studentClasses.length === 0">
              <q-item-section>
                <q-item-label class="text-center text-grey">
                  You are not enrolled in any classes yet.
                  <div class="q-mt-sm">
                    <q-btn color="primary" label="Enroll in a Class" @click="openEnrollDialog" />
                  </div>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="accent" @click="openEnrollDialog" />
    </q-page-sticky>

    <q-dialog v-model="showEnrollDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Enroll in a Class</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="classCode"
            label="Enter Class Code"
            :error="!!codeError"
            :error-message="codeError"
            :rules="[
              v => !!v || 'Class code is required',
              v => v.length >= 4 || 'Code must be at least 4 characters'
            ]"
            @keyup.enter="enrollInClass"
          />
          <div class="text-caption q-mt-sm">
            Enter the class code provided by your teacher to enroll in the class.
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="negative" v-close-popup />
          <q-btn
            flat
            label="Enroll"
            color="positive"
            @click="enrollInClass"
            :loading="isLoading"
            :disable="!classCode"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>