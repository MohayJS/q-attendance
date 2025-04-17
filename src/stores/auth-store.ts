import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accounts: [
      {
        username: 'student',
        password: 'student',
        role: 'student',
        status: 'inactive'
      },
      {
        username: 'teacher',
        password: 'teacher',
        role: 'teacher',
        status: 'active'
      },
      {
        username: 'supervisor',
        password: 'supervisor',
        role: 'supervisor',
        status: 'pending'
      },
      {
        username: 'admin',
        password: 'admin',
        role: 'admin',
        status: 'active'
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
      if (account) {
        return account;
      }
      return null;
    },
  },
});