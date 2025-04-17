<script setup lang="ts">
import { useRouter } from 'vue-router';
import { SessionStorage } from 'quasar';
import { ref } from 'vue';

const isCurrent_User = ref(SessionStorage.getItem('CURRENT_USER') !== null);
const router = useRouter();

const signinbutton = () => {
  router.push('/login').catch(() => {
  });
};

const gotoDashboard = () => {
  const user: { role: string } = SessionStorage.getItem('CURRENT_USER')!;

  if (user.role === 'student') {
    void router.push('/student');
  } else if (user.role === 'teacher') {
    void router.push('/teacher');
  } else if (user.role === 'supervisor') {
    void router.push('/supervisor');
  } else if (user.role === 'admin') {
    void router.push('/admin');
  }
}

</script>

<template>
  <q-page class="mainpage">
    <div>
      <h3 class="text-center" color="white">Landing Page</h3>
      <div class="buttons">
        <div v-if="isCurrent_User">
          <q-btn label="Dashboard" color="primary" @click="gotoDashboard" />
        </div>
        <div v-else>
          <q-btn label="Sign In" color="primary" @click="signinbutton" />
          <q-btn label="Sign Up" color="brown"/>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style>
.mainpage {
  align-items: center;
  display: flex;
  justify-content: center;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
