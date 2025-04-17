<script setup lang="ts">
import { useRouter } from 'vue-router';
import { logout } from 'src/utils/redirect';

const router = useRouter();

function signOff() {
    logout(router);
}
</script>

<template>
  <q-page>
    <h1>Student Dashboard</h1>
    <q-btn color="primary" @click="signOff">Logout</q-btn>

    <div>
      <router-view />
    </div>
  </q-page>
</template>