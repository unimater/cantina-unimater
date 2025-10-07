import { type Usuario } from '@/type/Usuario';

export const authUtils = {
  isAuthenticated(): boolean {
    const user = localStorage.getItem('user');
    if (!user) return false;

    try {
      const userData = JSON.parse(user);
      return userData && userData.id;
    } catch {
      localStorage.removeItem('user');
      return false;
    }
  },

  getUser(): Usuario | null {
    const user = localStorage.getItem('user');
    if (!user) return null;

    try {
      return JSON.parse(user);
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  },

  setUser(userData: Usuario): void {
    localStorage.setItem('user', JSON.stringify(userData));
  },

  removeUser(): void {
    localStorage.removeItem('user');
  },
};
