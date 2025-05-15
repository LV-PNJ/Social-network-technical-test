import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux'; 
import { User } from '../types/user';
import { userApiSlice, useLazyGetCurrentUserQuery } from '@/features/authentication/services/userApiSlice'; 
import { getStoredToken, removeStoredToken, removeStoredUser } from '@/utils/storage';

interface AuthContextType {
  currentUser: User | null;
  token: string | null; // Keep token in context for convenience if needed by consumers
  logout: () => void;
  isLoading: boolean; // Loading state for initial user fetch
  checkAuthStatus: () => Promise<void>; // Function to manually re-trigger auth check
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(() => getStoredToken());
  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true); // Renamed for clarity
  const dispatch = useDispatch();

  const [triggerGetMe, { data: userData, isLoading: isUserLoading, isFetching: isUserFetching, error: userError }] = useLazyGetCurrentUserQuery();

  const checkAuthStatus = useCallback(async () => {
    const currentToken = getStoredToken();
    setTokenState(currentToken);
    if (currentToken) {
      // Don't set setIsLoadingInitial(true) here again, let RTK query flags handle loading for this specific call
      try {
        const result = await triggerGetMe().unwrap();
        // 'result' is the transformed response: { status: boolean, data: User, ... }
        if (result && result.status && result.data) {
          console.log("AuthContext: User data fetched and validated, setting user:", result.data);
          setCurrentUser(result.data as User);
        } else {
          console.warn("AuthContext: User data fetched but was invalid or status false.", result);
          setCurrentUser(null);
          removeStoredToken();
          removeStoredUser();
          setTokenState(null);
        }
      } catch (error) {
        console.error("AuthContext: Failed to fetch user with token:", error);
        setCurrentUser(null);
        removeStoredToken();
        removeStoredUser();
        setTokenState(null);
      }
    } else {
      setCurrentUser(null);
      setTokenState(null); // Ensure token state is also cleared
    }
    setIsLoadingInitial(false); // Initial auth check attempt is complete
  }, [triggerGetMe, dispatch]); // Added dispatch as it's used in logout, though not directly in checkAuthStatus. Good practice if it were.

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const logout = useCallback(() => { // Wrapped in useCallback
    removeStoredToken();
    removeStoredUser();
    setTokenState(null);
    setCurrentUser(null);
    dispatch(userApiSlice.util.invalidateTags([{ type: 'User', id: 'ME' }]));
  }, [dispatch]);
  
  // isLoading should reflect the initial check OR any ongoing RTK query fetch for the user
  const effectiveIsLoading = isLoadingInitial || isUserLoading || isUserFetching;

  // Log currentUser changes for debugging (optional)
  useEffect(() => {
    console.log("AuthContext: currentUser state changed to:", currentUser);
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, token, logout, isLoading: effectiveIsLoading, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UseAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('UseAuth must be used within an AuthProvider');
  }
  return context;
};