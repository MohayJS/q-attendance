<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');

async function onSubmit() {
  const auth = await authStore.login(username.value, password.value);
  if (auth) {
    await router.replace({ name: `${authStore.currentAccount?.role}` });
  }
}
async function continueWithGoogle() {
  await authStore.loginWithGoogle();
  await router.replace({ name: `${authStore.currentAccount?.role}` });
}
</script>

<template>
  <div class="top-border">QUASAR ATTENDANCE SYSTEM</div>
  <q-page class="page-center">
    <q-card
      class="my-card text-white q-ma-xl"
      style="background: radial-gradient(circle, #efeeea 0%, #f8f4e1 100%)"
    >
      <q-card-section>
        <img class="msupic" src="/src/assets/msulogo2.png" height="80px" width="80px" />
        <h4 class="signin-text">Please sign-in your account if mayron</h4>
        <q-form @submit="onSubmit">
          <div class="row">
            <div class="username-box">
              <q-input
                class="col-6"
                v-model="username"
                placeholder="Username"
                style="font-weight: bold"
              />
            </div>
            <div class="username-box">
              <q-input class="col-6" v-model="password" type="password" placeholder="Password" />
            </div>
          </div>
          <q-btn class="login-button" type="submit">Login</q-btn>
        </q-form>
        <q-card-actions>
          <q-btn class="login-button" @click="continueWithGoogle()">Continue with Google</q-btn>
        </q-card-actions>
      </q-card-section>
    </q-card>


    <div>
      <router-view />
    </div>
  </q-page>
</template>
<style scoped>
.top-border {
  border-top: 5px solid #800000; /* blue border */
  width: 100%;
  font-weight: bolder;
  text-align: center;
  padding: 12px 0;
  font-size: 30px;
  font-weight: bold;
  color: white;
  background-color: #800000;
  border-bottom: 3px solid #800000;
}
.my-card {
  max-width: 400px;
  margin: auto;
  width: 100%;
  margin-top: 100px;
  height: 400px;
}
.page-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200vh; /* full screen height */
  background-color: #f8f4e1; /* optional background */
  flex-direction: column;
}
.msupic{
  display: block;
  margin: 0 auto;

}
.signin-text{
  color: grey;
  font-size: 15px;
  display: block;
  text-align: center;
}
.row {
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 16px;
}
.username-box {
  flex: 1;
  font-weight: bold;
  width: 100%;
}
.passsword-box {
  flex: 1;
  font-weight: bold;
}

.table-auto {
  margin-top: 20px;
  width: 100%;
}

.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0px;
  width: 100%;
}
.login-button {
  background-color: #800000;
  color: white;
  align-items: center;
  display: block;
  margin: 0 auto;
  margin-top: 20px;
  font-size: 16px;
  padding: 15px;
  padding-left: 20px;
  padding-right: 20px;
}
.tableacc {
  width: 100%;
}
</style>
