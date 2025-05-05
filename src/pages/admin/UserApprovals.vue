<script setup lang="ts">
import type { QTableColumn } from 'quasar'; // Changed to import type
import { UserModel } from 'src/models/user.models';
import { useUsersStore } from 'src/stores/user-store';
import { computed, onMounted } from 'vue';

const columns: QTableColumn[] = [
  {
    name: 'username',
    required: true,
    label: 'Email',
    align: 'left',
    field: (row: UserModel) => row.email,
    format: (val: string) => `${val}`,
    sortable: true,
  },
  { name: 'role', align: 'center', label: 'Role', field: 'role', sortable: true },
  { name: 'time', label: 'Time', field: 'time', sortable: true },
  {
    name: 'actions',
    label: 'Actions',
    align: 'center',
    field: '',
    sortable: false,
  },
];
const userStore = useUsersStore();

const rows = computed(() => userStore.users);

onMounted(async () => {
  await userStore.loadUsers();
});

const approveItem = (row: UserModel) => {
  const index = rows.value.findIndex((r) => r.email === row.email);
  if (index !== -1) {
    rows.value[index]!.status = 'active';
  }
  console.log(rows.value[index]?.status);
};

const deleteItem = (row: UserModel) => {
  const index = rows.value.findIndex((r) => r.email === row.email);
  if (index !== -1) {
    rows.value.splice(index, 1);
  }
};
</script>

<template>
  <q-page class="q-pa-md" style="margin-top: 1rem">
    <q-table title="User pending approvals" :rows="rows" :columns="columns" row-key="name">
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
          <q-btn color="red" icon="delete" dense round @click="deleteItem(props.row)">
            <q-tooltip>Delete</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>
