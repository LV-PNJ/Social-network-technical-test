import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Adjust the path as needed

export const UseAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('UseAuth must be used within an AuthProvider');
  }
  return context;
};