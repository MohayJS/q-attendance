<script setup lang="ts">
import { useRouter } from 'vue-router';
import { logout, checkStatusAcc, getAccount } from 'src/utils/redirect';

const router = useRouter();
checkStatusAcc(router)

interface Account {
  username: string;
  password: string;
  role: string;
  status: string;
}

const account = getAccount() as Account;


function signOff() {
  logout(router);
}
</script>

<template>
    <div>
        <h1>Account Status</h1>
        <h5>Welcome to the account status page. You can check your account status here.</h5>
        <p>Username: {{account.username}}</p>
        <p>Password: {{account.password}}</p>
        <p>Role: {{account.role}}</p>
        <p>Status: {{account.status}}</p>
        <q-btn color="primary" @click="signOff">Logout</q-btn>
    </div>
</template>