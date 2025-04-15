<template>
  <q-page class="mainpage">
    <div>
      <h3 class="text-center" color="white">Landing Page</h3>
      <div class="buttons">
        <q-btn label="Sign In" color="primary" @click="signinbutton" />
        <q-btn label="Sign Up" color="brown"/>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">

    import { useRouter } from 'vue-router';

        const router = useRouter();

        const signinbutton = () => {
           router.push('/login').catch(() => {
        });

    };


</script>

<style>
.mainpage {
  align-items: center;
  display: flex;
  justify-content: center;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
