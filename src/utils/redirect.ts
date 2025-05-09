import { SessionStorage } from 'quasar';
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

export function logout(router: Router) {
  SessionStorage.remove('CURRENT_USER');
  void router.push('/');
}

export function getAccount() {
  const auth: { role: string, status: string } | null = SessionStorage.getItem("CURRENT_USER");
  return auth;
}