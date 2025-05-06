<script setup lang="ts">
import type { QTableColumn } from 'quasar';
import { UserModel } from 'src/models/user.models';
import { useAuthStore } from 'src/stores/auth-store';
import { useUsersStore } from 'src/stores/user-store';
import { computed, onMounted, ref } from 'vue';

const useStore = useUsersStore();
const authStore = useAuthStore();

const rowsPerPage = ref([10]);
const columns: QTableColumn[] = [
  { 
    name: 'fullName',
    required: true,
    label: 'Username',
    align: 'left',
    field: (row: UserModel) => row.fullName,
    format: (val: string) => `${val}`,
    sortable: true
  },
  { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
  { name: 'role', align: 'center', label: 'Role', field: 'role', sortable: true },
];

const rows = computed(() => useStore.users)

onMounted(async () => {
  await useStore.loadUsers();
})

async function updateRole(val: 'student' | 'teacher' | 'supervisor' | 'admin', key: string) {
  await authStore.updateRole(val, key);
}

</script>

<template>
    <q-page class="q-pa-md" style="margin-top: 1rem;">
      <q-table 
        title="Role Management"
        :rows="rows"
        :columns="columns"
        :rows-per-page-options="rowsPerPage"
        row-key="name"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="fullName" :props="props">
              {{ props.row.fullName }}
            </q-td>
            <q-td key="email" :props="props">
                {{ props.row.email }}
            </q-td>
            <q-td key="role" :props="props">
              <div :class="{
                'role-badge': true,
                'role-admin': props.row.role === 'admin',
                'role-teacher': props.row.role === 'teacher',
                'role-student': props.row.role === 'student',
                'role-supervisor': props.row.role === 'supervisor'
              }">
                {{ props.row.role }}
              </div>
              <q-popup-edit v-model="props.row.role" title="Update role" buttons v-slot="scope" @save="(val) => updateRole(val, props.row.key)">
                <q-option-group
                  v-model="scope.value"
                  :options="[
                    { label: 'Student', value: 'student' },
                    { label: 'Teacher', value: 'teacher' },
                    { label: 'Supervisor', value: 'supervisor' },
                    { label: 'Admin', value: 'admin' },
                  ]"
                  type="radio"
                  dense
                />
              </q-popup-edit>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-page>
  </template>

<style scoped>
.role-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  text-transform: capitalize;
}

.role-admin {
  background-color: #790622;
  color: white;
}

.role-teacher {
  background-color: #31ccec;
  color: white;
}

.role-supervisor {
  background-color: #f2c037;
  color: white;
}

.role-student {
  background-color: #21ba45;
  color: white;
}
</style>
  
