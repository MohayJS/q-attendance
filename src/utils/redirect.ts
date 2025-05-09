import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth-store';
import { useRouter } from 'vue-router';

export function useLogout() {
  const $q = useQuasar();
  const router = useRouter();
  const authStore = useAuthStore();

  const logout = () => {
    $q.notify({
      message: 'Are you sure',
      actions: [
        {
          label: 'Yes', handler() {
            void authStore.logout();
            void router.push('/');
          },
        }, { label: 'Maybe' }
      ]
    });
  };

  return { logout };
}
