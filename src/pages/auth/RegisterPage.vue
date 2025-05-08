<script setup lang="ts">
import { useAuthStore } from 'src/stores/auth-store';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const password = ref('');
const fullName = ref('');
const askRole = ref(false);
const registerWithGoogle = ref(false);

function onSubmit() {
  if (username.value && password.value && fullName.value) {
    askRole.value = true;
  }
}

async function register(role: string) {
  if (!registerWithGoogle.value) {
    await authStore.register(username.value, password.value, fullName.value, role);
    await router.replace({ name: `${role}` });
  } else {
    const user = await authStore.authorizeUser('', role);
    await router.replace({ name: `${user?.role}` });
  }
}

async function continueWithGoogle() {
  const user = await authStore.loginWithGoogle();

  if (user) {
    askRole.value = true;
    registerWithGoogle.value = true;
  } else {
    const user = await authStore.authorizeUser();
    await router.replace({ name: `${user?.role}` });
  }
}

</script>

<template>
    <q-page>
      <q-card
        v-if="!askRole"
        class="my-card text-white q-ma-xl"
        style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
      >
        <q-card-section>
          <q-form @submit="onSubmit">
            <div class="row">
              <q-input class="col-6" v-model="fullName" placeholder="full name" />
              <q-input class="col-6" v-model="username" placeholder="email" />
              <q-input class="col-6" v-model="password" type="password" placeholder="password" />
            </div>
            <q-btn type="submit">Register</q-btn>
          </q-form>
          <q-btn @click="continueWithGoogle">Continue with Google</q-btn>
        </q-card-section>
      </q-card>

      <div v-else>
        Select your role
        <q-btn @click="register('student')">student</q-btn>
        <q-btn @click="register('teacher')">teacher</q-btn>
        <q-btn @click="register('supervisor')">supervisor</q-btn>
        <q-btn @click="register('admin')">admin</q-btn>
      </div>
  
      <div>
        <router-view />
      </div>
    </q-page>
  </template>