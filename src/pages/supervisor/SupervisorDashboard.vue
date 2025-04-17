<script setup lang="ts">
import { useRouter } from 'vue-router';
import { SessionStorage } from 'quasar';

const router = useRouter();

// Checking if there are user credentials in session storage
const auth = SessionStorage.getItem('CURRENT_USER');
if (!auth) {
    void router.push('/');
}

function logout() {
    SessionStorage.remove('CURRENT_USER');
    void router.push('/');
}
</script>

<template>
  <q-page>
    <h1>Supervisor Dashboard</h1>
    <q-btn color="primary" @click="logout">Logout</q-btn>

    <div>
      <router-view />
    </div>
  </q-page>
</template>