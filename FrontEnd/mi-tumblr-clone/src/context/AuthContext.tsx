import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { User } from '../types/user';
import { userApiSlice, useLazyGetCurrentUserQuery } from '@/features/authentication/services/userApiSlice';
import {
  getStoredToken,
  removeStoredToken,
  removeStoredUser,
  setStoredToken,
  setStoredUser,
} from '@/utils/storage';

interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  logout: () => void;
  isLoading: boolean;
  /** Persists token (optional) then loads /profiles/me with Authorization. */
  checkAuthStatus: (tokenOverride?: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(() => getStoredToken());
  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true);
  const dispatch = useDispatch();

  const [triggerGetMe, { isLoading: isUserLoading, isFetching: isUserFetching }] =
    useLazyGetCurrentUserQuery();

  const checkAuthStatus = useCallback(
    async (tokenOverride?: string) => {
      if (tokenOverride) {
        setStoredToken(tokenOverride);
      }
      const currentToken = tokenOverride ?? getStoredToken();
      setTokenState(currentToken);

      if (!currentToken) {
        setCurrentUser(null);
        setIsLoadingInitial(false);
        return;
      }

      try {
        const result = await triggerGetMe().unwrap();
        if (result?.status && result.data) {
          setCurrentUser(result.data as User);
          setStoredUser(result.data as User);
        } else {
          setCurrentUser(null);
          removeStoredToken();
          removeStoredUser();
          setTokenState(null);
        }
      } catch (error) {
        console.error('AuthContext: Failed to fetch /profiles/me:', error);
        setCurrentUser(null);
        removeStoredToken();
        removeStoredUser();
        setTokenState(null);
      } finally {
        setIsLoadingInitial(false);
      }
    },
    [triggerGetMe]
  );

  useEffect(() => {
    void checkAuthStatus();
  }, [checkAuthStatus]);

  const logout = useCallback(() => {
    removeStoredToken();
    removeStoredUser();
    setTokenState(null);
    setCurrentUser(null);
    dispatch(userApiSlice.util.invalidateTags([{ type: 'User', id: 'ME' }]));
  }, [dispatch]);

  const effectiveIsLoading = isLoadingInitial || isUserLoading || isUserFetching;

  return (
    <AuthContext.Provider
      value={{ currentUser, token, logout, isLoading: effectiveIsLoading, checkAuthStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
};
