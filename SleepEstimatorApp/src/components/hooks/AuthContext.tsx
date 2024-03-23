// src/hooks/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface AuthContextType {
  user: FirebaseAuthTypes.User | null; // Firebase user object
  userDetails: { email: string | null }; // Additional user details
  initializing: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC = ({ children }) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [userDetails, setUserDetails] = useState({ email: null });

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        setUserDetails({ email: user.email });
      } else {
        setUserDetails({ email: null });
      }
      if (initializing) setInitializing(false);
    });

    return subscriber; // unsubscribe on unmount
  }, [initializing]);

  const value = { user, userDetails, initializing };

  return (
    <AuthContext.Provider value={value}>
      {!initializing && children}
    </AuthContext.Provider>
  );
};
