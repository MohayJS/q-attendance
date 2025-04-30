<script setup lang="ts">
import { useRouter } from 'vue-router';
import { SessionStorage } from 'quasar';

const router = useRouter();

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
     <!-- Logout Button -->
    <q-btn color="primary" @click="logout">Log out</q-btn>
  </q-page>
</template>
