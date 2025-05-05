<script setup lang="ts">
import { useRouter } from 'vue-router';
import { logout } from 'src/utils/redirect';

function signOff() {
  logout();
}
</script>

<template>
  <q-page>
    <q-btn color="primary" @click="signOff">Logout</q-btn>
  </q-page>
</template>
