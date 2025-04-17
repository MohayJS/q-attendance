import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accounts: [
      {
        username: 'student',
        password: 'student',
        role: 'student',
      },
      {
        username: 'teacher',
        password: 'teacher',
        role: 'teacher',
      },
      {
        username: 'supervisor',
        password: 'supervisor',
        role: 'supervisor',
      },
      {
        username: 'admin',
        password: 'admin',
        role: 'admin',
      },
    ],
  }),
  getters: {
    getAccounts: (state) => state.accounts,
  },
  actions: {
    login(username: string, password: string) {
      const account = this.accounts.find(
        (account) => account.username === username && account.password === password
      );
      return account || null;
    },
  },
});