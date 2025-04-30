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
  const auth = authStore.login(username.value, password.value);
  if (auth) {
    SessionStorage.set('CURRENT_USER', auth);
    checkStatusAcc(router);
  } else {
    alert('Invalid username or password');
  }
}

function showAccounts() {
  const acc = authStore;
  accounts.value = acc.accounts;
  showTable.value = !showTable.value;
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
        <img class="msupic" src="/src/assets/msulogo2.png" height="80px" width="80px">
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
      </q-card-section>
    </q-card>

    <div class="flex">
      <q-btn
        class="buttontable"
        :label="showTable ? 'Hide Existing Accounts' : 'Show Existing Accounts'"
        color="primary"
        @click="showAccounts"
      />
      <p>Number of Accounts: {{ accounts.length }}</p>
    </div>
    <div class="tableacc" v-if="showTable">
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
              <q-badge
                :color="
                  acc.status === 'active'
                    ? 'positive'
                    : acc.status === 'inactive'
                      ? 'negative'
                      : 'warning'
                "
              >
                {{ acc.status }}
              </q-badge>
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
