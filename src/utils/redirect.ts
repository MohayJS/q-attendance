import { SessionStorage, useQuasar } from 'quasar';
import type { Router } from 'vue-router';

export function checkStatusAcc(router: Router) {
  const auth: { role: string, status: string } | null = SessionStorage.getItem("CURRENT_USER");

  if (auth) {
    if (auth.status === 'active') {
      void router.push(`/${auth.role}`);
    } else if (auth.status === 'pending' || auth.status === 'inactive') {
      void router.push('/status');
    }
  }
}
const $q = useQuasar();
export function logout(router: Router) {
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
