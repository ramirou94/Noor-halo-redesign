import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Alert } from 'react-native';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../utils/firebaseConfig';
import { storage } from '../utils/storage';
import { useAuth } from './AuthContext';
import {
  initializePurchases,
  purchaseMonthly as rcPurchaseMonthly,
  purchaseYearly as rcPurchaseYearly,
  restorePurchases as rcRestorePurchases,
  checkPremiumStatus as rcCheckPremiumStatus,
} from '../utils/purchases';

interface PremiumContextValue {
  isPremium: boolean;
  loading: boolean;
  purchaseMonthly: () => Promise<void>;
  purchaseYearly: () => Promise<void>;
  restorePurchases: () => Promise<void>;
  setPremiumFromServer: (value: boolean) => void;
}

const PremiumContext = createContext<PremiumContextValue | undefined>(undefined);

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within PremiumProvider');
  }
  return context;
};

interface PremiumProviderProps {
  children: ReactNode;
}

export const PremiumProvider: React.FC<PremiumProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializePremiumStatus();
  }, [user]);

  const initializePremiumStatus = async () => {
    try {
      // Initialize RevenueCat
      await initializePurchases(user?.uid);

      // Check RevenueCat entitlement first (if configured)
      try {
        const rcPremium = await rcCheckPremiumStatus();
        if (rcPremium) {
          setIsPremium(true);
          await storage.setItem('premium_status', true);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.log('RevenueCat not configured, falling back to Firestore/local');
      }

      // Fallback: check local storage
      const localPremium = await storage.getItem<boolean>('premium_status');
      
      if (user && firestore) {
        // If user is logged in, check Firestore
        const userRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          const remotePremium = data.isPremium || false;
          setIsPremium(remotePremium);
          await storage.setItem('premium_status', remotePremium);
        } else {
          setIsPremium(localPremium || false);
        }
      } else {
        // Guest mode
        setIsPremium(localPremium || false);
      }
    } catch (error) {
      console.error('Error initializing premium status:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePremiumStatus = async (status: boolean) => {
    setIsPremium(status);
    await storage.setItem('premium_status', status);

    // Sync to Firestore if logged in
    if (user && firestore) {
      try {
        const userRef = doc(firestore, 'users', user.uid);
        await updateDoc(userRef, {
          isPremium: status,
          updatedAt: new Date().toISOString(),
        });
        console.log('✅ Premium status synced to Firestore');
      } catch (error) {
        console.error('⚠️ Failed to sync premium status:', error);
      }
    }
  };

  const purchaseMonthly = async () => {
    try {
      const { success, isPremium: premiumStatus } = await rcPurchaseMonthly();
      
      if (success && premiumStatus) {
        await savePremiumStatus(true);
        Alert.alert('Succès', 'Noor Halo Plus activé! ✨');
      }
    } catch (error: any) {
      console.error('Purchase error:', error);
      Alert.alert('Erreur', 'Impossible de compléter l\'achat');
    }
  };

  const purchaseYearly = async () => {
    try {
      const { success, isPremium: premiumStatus } = await rcPurchaseYearly();
      
      if (success && premiumStatus) {
        await savePremiumStatus(true);
        Alert.alert('Succès', 'Noor Halo Plus activé! ✨');
      }
    } catch (error: any) {
      console.error('Purchase error:', error);
      Alert.alert('Erreur', 'Impossible de compléter l\'achat');
    }
  };

  const restorePurchases = async () => {
    try {
      const { success, isPremium: premiumStatus } = await rcRestorePurchases();
      
      if (success && premiumStatus) {
        await savePremiumStatus(true);
        Alert.alert('Succès', 'Statut Premium restauré! ✨');
      } else {
        Alert.alert('Aucun achat', 'Aucun abonnement actif trouvé');
      }
    } catch (error: any) {
      console.error('Restore error:', error);
      Alert.alert('Erreur', 'Impossible de restaurer les achats');
    }
  };

  const setPremiumFromServer = (value: boolean) => {
    savePremiumStatus(value);
  };

  const value: PremiumContextValue = {
    isPremium,
    loading,
    purchaseMonthly,
    purchaseYearly,
    restorePurchases,
    setPremiumFromServer,
  };

  return <PremiumContext.Provider value={value}>{children}</PremiumContext.Provider>;
};

export default PremiumContext;
