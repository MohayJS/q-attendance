<script setup lang="ts">
import { ref } from 'vue';

const username = ref('');
const password = ref('');

function onSubmit() {
    alert(`This system is yet to accept any incoming data.`);
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
            <q-btn type="submit">Register</q-btn>
          </q-form>
        </q-card-section>
      </q-card>
  
      <div>
        <router-view />
      </div>
    </q-page>
  </template>