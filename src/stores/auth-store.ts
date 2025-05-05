import { defineStore } from 'pinia';
import type { UserModel } from 'src/models/user.models';
import { firebaseService } from 'src/services/firebase-service';
interface IState {
  currentAccount?: UserModel | undefined
}
export const useAuthStore = defineStore('auth', {
  state: () => ({} as IState),
  getters: {
    isUserAdmin: (state) => state.currentAccount?.role == 'admin',
  },
  actions: {
    async login(username: string, password: string) {
      await firebaseService.signWithEmailPassword(username, password);
      return this.authorizeUser();
    },
    async loginWithGoogle() {
      await firebaseService.signInWithGoogle();
      return this.authorizeUser();
    },
    async register(email: string, password: string) {
      await firebaseService.registerWithEmailPassword(email, password);
      return this.authorizeUser();
    },
    async authorizeUser() {
      const user = await firebaseService.authorizeUser();
      if (user) {
        this.currentAccount = {
          key: user.uid,
          avatar: user.photoURL || '',
          email: user.email || '',
          emailVerified: !!user.emailVerified,
          fullName: user.displayName || ''
        }
        return this.currentAccount;
      } else {
        this.currentAccount = undefined;
      }
    },
    async logout() {
      await firebaseService.signOut();
    },
    sendForgetPassword(email: string) {
      return firebaseService.resetPassword(email);
    }
  },
});
