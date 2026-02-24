import { getUserFromToken } from './tokenUtils';

export const logoutUser = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

export const getUserRole = () => {
  const user = getUserFromToken();
  
  if (!user) return null;

  if (user.is_staff) {
    return 'admin';
  }

  return 'teacher';
};
