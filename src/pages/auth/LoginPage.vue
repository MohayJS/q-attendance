<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';
import { SessionStorage } from 'quasar';
import { checkStatusAcc } from 'src/utils/redirect';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const showTable = ref(false);

interface Accounts {
  username: string;
  password: string;
  role: string;
  status: string;
}

const accounts = ref<Accounts[]>([]);

function onSubmit() {
  const auth = authStore.login(username.value, password.value)
  if (auth) {
    SessionStorage.set("CURRENT_USER", auth)
    checkStatusAcc(router);
  } else {
    alert("Invalid username or password")
  }
}

function showAccounts() {
  const acc = authStore;
  accounts.value = acc.accounts;
  showTable.value = !showTable.value;
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

    <q-btn label="Show Existing Accounts" color="primary" @click="showAccounts" />
    <div v-if="showTable">
      <q-markup-table flat bordered class="table-auto">
        <thead>
          <tr>
            <th class="text-left">Username</th>
            <th class="text-left">Password</th>
            <th class="text-left">Role</th>
            <th class="text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="acc in accounts" :key="acc.username">
            <td>{{ acc.username }}</td>
            <td>{{ acc.password }}</td>
            <td>{{ acc.role }}</td>
            <td>
              <q-badge :color="acc.status === 'active' ? 'positive' : acc.status === 'inactive' ? 'negative' : 'warning'" > {{ acc.status }} </q-badge>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
    <div>
      <router-view />
    </div>
  </q-page>
</template>