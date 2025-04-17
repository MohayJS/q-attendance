<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Quasar Attendance System </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menu </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';
import { SessionStorage } from 'quasar';

const linksList: EssentialLinkProps[] = [
  {
    title: 'Home',
    caption: 'Home',
    icon: 'home',
    link: '/',
  },
  {
    title: 'Classes',
    caption: 'Classes',
    icon: 'school',
    link: '/class',
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

// Checking if there's a current user in session storage
// If so, then redirect to the appropriate dashboard
const user: { role: string } = SessionStorage.getItem('CURRENT_USER')!;

if (user.role === 'student') {
  window.location.href = '/student/dashboard';
} else if (user.role === 'teacher') {
  window.location.href = '/teacher/dashboard';
} else if (user.role === 'admin') {
  window.location.href = '/admin/dashboard';
}
</script>
