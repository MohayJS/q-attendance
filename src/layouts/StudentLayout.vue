<script setup lang='ts'>
import EssentialLink, { EssentialLinkProps } from 'src/components/EssentialLink.vue';
import { checkStatusAcc } from 'src/utils/redirect';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const drawer = ref(true);
const miniState = ref(false);
checkStatusAcc(router);

function drawerClick() {
  if (miniState.value) {
    miniState.value = false;
  }
}

const linksList: EssentialLinkProps[] = [
  {
    title: 'Dashboard',
    icon: 'space_dashboard',
    link: '/student',
  },
  {
    title: 'Classes',
    icon: 'menu_book',
    link: '/student/classes',
  },
  
]

</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header style="margin: 1rem; margin-left: 1.5rem;border-radius: 10px;">
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="drawer = !drawer" />

        <q-toolbar-title>Student Dashboard</q-toolbar-title>

        <q-btn round>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/avatar.png">
          </q-avatar>
          <q-menu>
            <q-btn color="primary" label="Logout" />
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      bordered
      :mini="!drawer || miniState"
      @click.capture="drawerClick()"
    >
      <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: '0'}">
        <q-card style="padding-top: 1rem; margin-bottom: 0.5rem;">
          <q-card-section>
            <div class="flex items-center gap-2">
              <q-icon size="2rem">
                <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
              </q-icon>
              <div v-if="!miniState" style="font-size: 1.4rem; margin-left: 0.5rem;">
                <strong>Hi, Luffy!</strong>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-list>
          <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
        </q-list>
      </q-scroll-area>
    </q-drawer>




    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>