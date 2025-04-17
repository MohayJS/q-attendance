<script setup lang='ts'>
import { checkStatusAcc } from 'src/utils/redirect';
import { useRouter } from 'vue-router';

const router = useRouter();
checkStatusAcc(router);
</script>

<template>
    <q-layout>
        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>