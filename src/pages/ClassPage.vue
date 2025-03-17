<script setup lang="ts">
import { uid } from 'quasar';
import { useClassStore } from 'src/stores/class-store';
import { computed, ref } from 'vue';

const classStore = useClassStore();
const classes = computed(() => {
  return classStore.classes;
});
const showNewClassDialog = ref(false);
const className = ref('');
function addNewClass() {
  showNewClassDialog.value = true;
}
function saveClass() {
  classStore.saveClass({
    key: uid(),
    name: className.value,
  });
  className.value = '';
  showNewClassDialog.value = false;
}
</script>
<template>
  <q-page>
    <div class="q-pa-md">
      <q-list bordered>
        <q-item
          v-for="theClass in classes"
          :key="theClass.key"
          class="q-my-sm"
          clickable
          v-ripple
          :to="{
            name: 'attendance',
            params: { classKey: theClass.key },
          }"
        >
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">
              {{ theClass.name[0] }}
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ theClass.name }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="chat_bubble" color="green" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <q-page-sticky position="bottom" :offset="[0, 0]">
      <q-btn fab icon="add" color="accent" @click="addNewClass()" />
    </q-page-sticky>
    <q-dialog position="standard" persistent v-model="showNewClassDialog">
      <q-card>
        <q-form @submit="saveClass()">
          <q-card-section>
            <q-input
              v-model="className"
              :rules="[
                (v) => (v && /^[a-z]/i.test(v)) || 'Should Start with a letter',
                (v) => (v && v.length > 3) || 'Should at least 4 characters',
              ]"
              placeholder="Class Name"
            />
          </q-card-section>
          <q-card-actions>
            <q-btn icon="cancel" color="secondary" v-close-popup>Cancel</q-btn>
            <q-btn icon="save" type="submit">Save</q-btn>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>
