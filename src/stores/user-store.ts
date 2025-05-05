import { defineStore, acceptHMRUpdate } from 'pinia';
import { UserModel } from 'src/models/user.models';
import { firebaseService } from 'src/services/firebase-service';

interface IState {
  users: UserModel[]
}
export const useUsersStore = defineStore('users', {
  state: () => ({
    users: []
  } as IState),

  getters: {

  },

  actions: {
    async loadUsers() {
      const users = await firebaseService.findRecords('users');
      this.users = users;
    }
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot));
}
