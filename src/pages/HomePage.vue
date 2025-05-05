<script setup lang="ts">
import { useRouter } from 'vue-router';
import { SessionStorage } from 'quasar';
import { ref } from 'vue';

const isCurrent_User = ref(SessionStorage.getItem('CURRENT_USER') !== null);
const router = useRouter();
// const alert = ref(false);

const signinbutton = () => {
  router.push('/auth/login').catch(() => {
  });
};

const signupbutton = () => {
  router.push('/auth/register').catch(() => {
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
          <q-btn label="Sign Up" color="brown" @click="signupbutton" />
        </div>
      </div>
    </div>

    <!-- REMOVE THIS LATER -->
     <!-- <div style="position: absolute; top: 80%; left: 50%; transform: translate(-50%,-50%);">
      <q-btn label="What's new" color="amber" @click="alert = true" />
     </div>


    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6">What's new</div>
          <p>4/18/2025 - 11:16pm</p>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <ul>
            <li>Updated Status Page (QS-8)</li>
            <li>Added Student Dashboard (QS-9)</li>
            <li>Added Teacher Dashboard (QS-10)</li>
            <li>Added Supervisor Dashboard (QS-11)</li>
            <li>Added Sign-up Page (QO-1)</li>
            <li>Updated Admin Dashboard (QS-12)</li>
            <li>Added User management page for Admin (QG-0)</li>
          </ul>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog> -->
    <!-- ---------------- -->


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
