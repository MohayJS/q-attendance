<script setup lang="ts">
import { useRouter } from 'vue-router';
import { logout, checkStatusAcc } from 'src/utils/redirect';

const router = useRouter();
checkStatusAcc(router)

function signOff() {
  logout(router);
}
</script>

<template>
    <div>
        <h1>Account Status</h1>
        <q-btn color="primary" @click="signOff">Logout</q-btn>
    </div>
</template>