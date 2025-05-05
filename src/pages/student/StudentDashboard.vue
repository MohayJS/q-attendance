<script setup lang="ts">
import { logout } from 'src/utils/redirect';
import { useRouter } from 'vue-router';
const router = useRouter();

function signOff() {
  logout();
}
</script>

<template>
  <q-page>
    <q-btn color="primary" @click="signOff" class="logout-btn">Logout</q-btn>
    <h1>aksjdjkasd</h1>
  </q-page>
</template>
