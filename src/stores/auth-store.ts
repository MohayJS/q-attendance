import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accounts: [
      {
        username: 'user1',
        password: 'user1',
        role: 'student',
        status: 'inactive'
      },
      {
        username: 'user2',
        password: 'user2',
        role: 'teacher',
        status: 'pending'
      },
      {
        username: 'student',
        password: 'student',
        role: 'student',
        status: 'active'
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
        status: 'active'
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