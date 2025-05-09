<script setup lang="ts">
import { useLogout } from 'src/utils/redirect';

const { logout } = useLogout();

function signOff() {
  logout();
}
</script>

<template>
  <q-page>
    <q-btn color="primary" @click="signOff">Logout</q-btn>
  </q-page>
</template>
