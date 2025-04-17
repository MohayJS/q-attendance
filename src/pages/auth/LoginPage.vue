<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';
import { SessionStorage } from 'quasar';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');

function onSubmit() {
  const auth = authStore.login(username.value, password.value)
  if (auth) {
    SessionStorage.set("CURRENT_USER", auth)
    void router.push('/'+auth.role)
  } else {
    alert("Invalid username or password")
  }
}
</script>



<template>
  <q-page>
    <q-card
      class="my-card text-white q-ma-xl"
      style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
    >
      <q-card-section>
        <q-form @submit="onSubmit">
          <div class="row">
            <q-input class="col-6" v-model="username" placeholder="username" />
            <q-input class="col-6" v-model="password" type="password" placeholder="password" />
          </div>
          <q-btn type="submit">Login</q-btn>
        </q-form>
      </q-card-section>
    </q-card>

    <div>
      <router-view />
    </div>
  </q-page>
</template>
