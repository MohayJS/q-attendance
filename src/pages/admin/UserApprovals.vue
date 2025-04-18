<script setup lang="ts">
import type { QTableColumn } from 'quasar'; // Changed to import type
import { ref } from 'vue';

interface Accounts {
  username: string;
  role: string;
  time: string;
  status: 'pending' | 'active' | 'inactive';
}

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
  { name: 'time', label: 'Time', field: 'time', sortable: true },
  {
    name: 'actions',
    label: 'Actions',
    align: 'center',
    field: '',
    sortable: false
  }
];

const rows = ref([
  { username: 'monkey_d_luffy', role: "student", time: "4 hours ago", status: 'pending' },
  { username: 'roronoa_zoro', role: "student", time: "3 hours ago", status: 'pending' },
  { username: 'nami', role: "teacher", time: "2 hours ago", status: 'pending' },
  { username: 'sanji', role: "supervisor", time: "4 hours ago", status: 'pending' },
  { username: 'usopp', role: "teacher", time: "2 hours ago", status: 'pending' }
]);

const approveItem = (row: Accounts) => {
  const index = rows.value.findIndex(r => r.username === row.username);
  if (index !== -1) {
    rows.value[index]!.status = 'active';
  }
  console.log(rows.value[index]?.status)
};

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
      title="User pending approvals"
      :rows="rows"
      :columns="columns"
      row-key="name"
    >
      <template #body-cell-actions="props">
        <q-td :props="props" class="q-gutter-xs">
          <q-btn 
            v-if="props.row.status === 'pending'"
            color="green"
            icon="check"
            dense
            round
            @click="approveItem(props.row)"
          >
            <q-tooltip>Approve</q-tooltip>
          </q-btn>
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
      </template>
    </q-table>
  </q-page>
</template>