<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';
import { onMounted } from 'vue';

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.authorizeUser();
});

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
