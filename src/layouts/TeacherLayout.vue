<script setup lang='ts'>
import EssentialLink, { EssentialLinkProps } from 'src/components/EssentialLink.vue';
import { useAuthStore } from 'src/stores/auth-store';
import { useLogout } from 'src/utils/redirect';
import { ref } from 'vue';

const { logout } = useLogout();
const authStore = useAuthStore();

const drawer = ref(false);
const miniState = ref(false);

const linksList: EssentialLinkProps[] = [
  {
    title: 'Dashboard',
    icon: 'space_dashboard',
    link: '/teacher',
},
  {
    title: 'Reserve 1',
    icon: 'menu_book',
    link: '/teacher/classes',
  },
  {
    title: 'Reserve 2',
    icon: 'menu_book',
    link: '/teacher/classes',
  }
];

function drawerClick() {
  if (miniState.value) {
    miniState.value = false;
  }
}
</script>

<template>
    <q-layout view="lHh Lpr lFf">
        <q-header style="margin: 1rem; margin-left: 1.5rem; border-radius: 10px;">
            <q-toolbar class="q-toolbar">
                <q-btn flat round dense icon="menu" @click="drawer = !drawer" />

                <q-toolbar-title>Hi, {{authStore.currentAccount?.fullName}}!</q-toolbar-title>

                <div class="q-gutter-sm">
                    <q-btn flat :size="'md'" round icon="add" />
                    <q-btn flat round>
                        <q-avatar>
                            <img :src="authStore.currentAccount?.avatar || 'https://cdn.quasar.dev/img/avatar.png'" />
                        </q-avatar>
                        <q-menu>
                            <q-btn color="primary" label="Logout" @click="logout" />
                        </q-menu>
                    </q-btn>
                </div>
            </q-toolbar>
        </q-header>

        <q-drawer
        v-model="drawer"
        show-if-above
        bordered
        :mini="!drawer || miniState"
        @click.capture="drawerClick()"
        >
        <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: '0' }">
            <q-card style="padding-top: 1rem;">
            <q-card-section>
                <div class="flex items-center gap-2">
                <q-icon size="2rem" class="self-center">
                    <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
                </q-icon>
                <div v-if="!miniState" style="font-size: 1.4rem; margin-left: 0.5rem;">
                    <strong>Q-Class Attendance</strong>
                </div>
                </div>
            </q-card-section>
            </q-card>

            <q-list padding>
            <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
            </q-list>
        </q-scroll-area>

        <div class="q-mini-drawer-hide absolute" style="top: 1.7rem; right: -17px">
            <q-btn
            dense
            round
            unelevated
            color="accent"
            icon="chevron_left"
            @click="miniState = true"
            />
        </div>
        </q-drawer>
        

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>
