<script setup lang="ts">
import { useLogout } from 'src/utils/redirect';

const { logout } = useLogout();

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
