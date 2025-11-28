import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from '../utils/firebaseConfig';
import { storage, StorageKeys } from '../utils/storage';
import { syncManager } from '../utils/syncManager';
import { loginUser as rcLoginUser, logoutUser as rcLogoutUser } from '../utils/purchases';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  provider?: 'password' | 'google' | 'apple';
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          provider: 'password',
        };
        setUser(authUser);
        
        // Initialize RevenueCat with user ID
        try {
          await rcLoginUser(firebaseUser.uid);
        } catch (error) {
          console.warn('RevenueCat login failed:', error);
        }
        
        // Check if user document exists, create if not
        await ensureUserDocument(firebaseUser);
        
        // Sync data with Firestore
        await syncManager.syncOnLogin(firebaseUser.uid);
      } else {
        setUser(null);
        
        // Logout from RevenueCat
        try {
          await rcLogoutUser();
        } catch (error) {
          console.warn('RevenueCat logout failed:', error);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const ensureUserDocument = async (firebaseUser: User) => {
    if (!firestore) return;

    try {
      const userRef = doc(firestore, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(userRef, {
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          isPremium: false,
        });
        console.log('✅ User document created');
        
        // Push all local data to Firestore
        await syncManager.pushAllLocalData(firebaseUser.uid);
      }
    } catch (error) {
      console.error('⚠️ Error ensuring user document:', error);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase not initialized');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await ensureUserDocument(userCredential.user);
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message || 'Failed to create account');
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase not initialized');

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  };

  const signInWithGoogle = async () => {
    console.log('Google Sign-In not implemented yet');
    throw new Error('Google Sign-In coming soon');
  };

  const signInWithApple = async () => {
    console.log('Apple Sign-In not implemented yet');
    throw new Error('Apple Sign-In coming soon');
  };

  const signOut = async () => {
    if (!auth) throw new Error('Firebase not initialized');

    try {
      // Logout from RevenueCat
      await rcLogoutUser();
      
      // Sync on logout (clear local data)
      await syncManager.syncOnLogout();
      
      // Sign out from Firebase
      await firebaseSignOut(auth);
      
      console.log('✅ Signed out successfully');
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  };

  const resetPassword = async (email: string) => {
    if (!auth) throw new Error('Firebase not initialized');

    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw new Error(error.message || 'Failed to send reset email');
    }
  };

  const value: AuthContextValue = {
    user,
    loading,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signInWithApple,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
