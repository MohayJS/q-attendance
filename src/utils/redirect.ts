import { SessionStorage, useQuasar } from 'quasar';
import { useRouter } from 'vue-router';


const $q = useQuasar();
const router = useRouter();
export function logout() {
  $q.notify({
    message: 'Are you sure',
    actions: [
      {
        label: 'Yes', handler() {
          SessionStorage.remove('CURRENT_USER');
          void router.push('/');
        },
      }, { label: 'Meybe' }
    ]
  })
}

export function getAccount() {
  const auth: { role: string, status: string } | null = SessionStorage.getItem("CURRENT_USER");
  return auth;
}
