<script setup lang="ts">
import type { QTableColumn } from 'quasar'; // Changed to import type
import { UserModel } from 'src/models/user.models';
import { useAuthStore } from 'src/stores/auth-store';
import { useUsersStore } from 'src/stores/user-store';
import { computed, onMounted } from 'vue';

const userStore = useUsersStore();
const authStore = useAuthStore();

const columns: QTableColumn[] = [
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: (row: UserModel) => row.fullName,
    format: (val: string) => `${val}`,
    sortable: true,
  },
  {
    name: 'email',
    align: 'left',
    label: 'Email',
    field: 'email',
    sortable: true,
  },
  { name: 'role', align: 'center', label: 'Role', field: 'role', sortable: true },
  {
    name: 'actions',
    label: 'Actions',
    align: 'center',
    field: '',
    sortable: false,
  },
];

const rows = computed(() => userStore.users.filter(user => user.status === 'pending'));

onMounted(async () => {
  await userStore.loadUsers();
});

const approveItem = async (key: string) => {
  await authStore.updateStatus('active', key);
  await userStore.loadUsers();
};

const deleteItem = async (key: string) => {
  await authStore.updateStatus('inactive', key)
  await userStore.loadUsers();
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
            @click="approveItem(props.row.key)"
          >
            <q-tooltip>Approve</q-tooltip>
          </q-btn>
          <q-btn color="red" icon="close" dense round @click="deleteItem(props.row.key)">
            <q-tooltip>Reject</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>
