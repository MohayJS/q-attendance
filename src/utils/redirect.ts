import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth-store';
import { useRouter } from 'vue-router';


const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();
export function logout() {
  $q.notify({
    message: 'Are you sure',
    actions: [
      {
        label: 'Yes', handler() {
          void authStore.logout();
          void router.push('/');
        },
      }, { label: 'Meybe' }
    ]
  })
}
