<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';

const authStore = useAuthStore();
console.log(authStore)

const router = useRouter();

const signinbutton = () => {
  void router.push('/auth/login')
};

const signupbutton = () => {
  void router.push('/auth/register')
};

const gotoDashboard = () => {
  void router.push(`${authStore.currentAccount?.role}`)
}

</script>

<template>
  <q-page class="mainpage">
    <div>
      <h3 class="text-center" color="white">Landing Page</h3>
      <div class="buttons">
        <div v-if="authStore.currentAccount">
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
