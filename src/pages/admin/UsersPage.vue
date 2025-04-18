<script setup lang="ts">
import type { QTableColumn } from 'quasar'; // Changed to import type
import { ref } from 'vue';

interface Accounts {
  username: string;
  role: string;
  status: 'pending' | 'active' | 'inactive';
}

const rowsPerPage = ref([10]);
const columns: QTableColumn[] = [
  { 
    name: 'username',
    required: true,
    label: 'Username',
    align: 'left',
    field: (row: Accounts) => row.username,
    format: (val: string) => `${val}`,
    sortable: true
  },
  { name: 'role', align: 'center', label: 'Role', field: 'role', sortable: true },
  { name: 'status', label: 'Status', field: 'status', sortable: true },
  {
    name: 'actions',
    label: 'Actions',
    align: 'center',
    field: '',
    sortable: false
  }
];

const rows = ref([
  { username: 'monkey_d_luffy', role: "student", status: 'active' },
  { username: 'roronoa_zoro', role: "student", status: 'active' },
  { username: 'nami', role: "teacher", status: 'pending' },
  { username: 'usopp', role: "student", status: 'active' },
  { username: 'sanji', role: "supervisor", status: 'pending' },
  { username: 'tony_chopper', role: "student", status: 'active' },
  { username: 'nico_robin', role: "teacher", status: 'active' },
  { username: 'franky', role: "teacher", status: 'inactive' },
  { username: 'brook', role: "student", status: 'active' },
  { username: 'jinbe', role: "supervisor", status: 'active' },
  { username: 'sakazuki', role: "admin", status: 'active' },
  { username: 'kuzan', role: "admin", status: 'inactive' },
  { username: 'borsalino', role: "admin", status: 'active' },
  { username: 'smoker', role: "supervisor", status: 'active' },
  { username: 'tashigi', role: "teacher", status: 'pending' },
  { username: 'kaido', role: "admin", status: 'inactive' },
  { username: 'big_mom', role: "admin", status: 'active' },
  { username: 'shanks', role: "admin", status: 'active' },
  { username: 'blackbeard', role: "admin", status: 'active' },
  { username: 'mihawk', role: "supervisor", status: 'active' },
  { username: 'boa_hancock', role: "supervisor", status: 'pending' },
  { username: 'buggy', role: "teacher", status: 'inactive' },
  { username: 'crocodile', role: "teacher", status: 'inactive' },
  { username: 'doflamingo', role: "teacher", status: 'inactive' },
  { username: 'law', role: "supervisor", status: 'active' },
  { username: 'kid', role: "teacher", status: 'pending' },
  { username: 'sabo', role: "supervisor", status: 'active' },
  { username: 'dragon', role: "admin", status: 'active' },
  { username: 'ivankov', role: "teacher", status: 'pending' }
]);

const deleteItem = (row: Accounts) => {
  const index = rows.value.findIndex(r => r.username === row.username);
  if (index !== -1) {
    rows.value.splice(index, 1);
  }
};

</script>

<template>
  <q-page class="q-pa-md" style="margin-top: 1rem;">
    <q-table 
      title="Users"
      :rows="rows"
      :columns="columns"
      :rows-per-page-options="rowsPerPage"
      row-key="name"
    >
      <!-- <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge 
            :color="props.row.status === 'active' ? 'positive' : 
                  props.row.status === 'inactive' ? 'negative' : 'warning'"
          >
            {{ props.row.status }}
          </q-badge>
        </q-td>
      </template> -->

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="username" :props="props">
            {{ props.row.username }}
            <q-popup-edit v-model="props.row.username" v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-td>
          <q-td key="role" :props="props">
            {{ props.row.role }}
            <q-popup-edit v-model="props.row.role" title="Update role" buttons v-slot="scope">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="status" :props="props">
            <div class="text-pre-wrap">
              <q-badge 
                :color="props.row.status === 'active' ? 'positive' : 
                      props.row.status === 'inactive' ? 'negative' : 'warning'"
              >
                {{ props.row.status }}
              </q-badge>
            </div>
            <q-popup-edit v-model="props.row.status" title="Update status" v-slot="scope">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn
              color="red"
              icon="delete"
              dense
              round
              @click="deleteItem(props.row)"
            >
              <q-tooltip>Delete</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>