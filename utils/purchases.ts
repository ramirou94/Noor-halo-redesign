import Purchases, { PurchasesOffering, CustomerInfo, PurchasesPackage } from 'react-native-purchases';
import { Platform } from 'react-native';

// RevenueCat API Keys (from .env)
const REVENUECAT_API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY || '';
const REVENUECAT_API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY || '';

// Product identifiers
export const ProductIds = {
  MONTHLY: 'noorhalo_monthly',
  YEARLY: 'noorhalo_yearly',
  LIFETIME: 'noorhalo_lifetime',
};

// Entitlement identifier
export const ENTITLEMENT_ID = 'premium';

let isConfigured = false;

/**
 * Initialize RevenueCat SDK
 */
export async function initializePurchases(userId?: string): Promise<void> {
  if (isConfigured) return;

  try {
    const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;

    if (!apiKey) {
      console.warn('⚠️ RevenueCat API key not configured - IAP disabled');
      return;
    }

    Purchases.configure({ apiKey });

    // Identify user if logged in
    if (userId) {
      await Purchases.logIn(userId);
    }

    isConfigured = true;
    console.log('✅ RevenueCat initialized');
  } catch (error) {
    console.error('Error initializing RevenueCat:', error);
  }
}

/**
 * Get available offerings (products)
 */
export async function getOfferings(): Promise<PurchasesOffering | null> {
  try {
    const offerings = await Purchases.getOfferings();
    
    if (offerings.current) {
      return offerings.current;
    }

    console.warn('No current offerings available');
    return null;
  } catch (error) {
    console.error('Error fetching offerings:', error);
    return null;
  }
}

/**
 * Purchase monthly subscription
 */
export async function purchaseMonthly(): Promise<{ success: boolean; isPremium: boolean }> {
  try {
    const offerings = await getOfferings();
    
    if (!offerings) {
      throw new Error('No offerings available');
    }

    // Find monthly package
    const monthlyPackage = offerings.availablePackages.find(
      (pkg) => pkg.identifier === ProductIds.MONTHLY
    );

    if (!monthlyPackage) {
      throw new Error('Monthly package not found');
    }

    const { customerInfo } = await Purchases.purchasePackage(monthlyPackage);
    const isPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

    return { success: true, isPremium };
  } catch (error: any) {
    if (error.userCancelled) {
      console.log('User cancelled purchase');
      return { success: false, isPremium: false };
    }

    console.error('Purchase error:', error);
    throw error;
  }
}

/**
 * Purchase yearly subscription
 */
export async function purchaseYearly(): Promise<{ success: boolean; isPremium: boolean }> {
  try {
    const offerings = await getOfferings();
    
    if (!offerings) {
      throw new Error('No offerings available');
    }

    const yearlyPackage = offerings.availablePackages.find(
      (pkg) => pkg.identifier === ProductIds.YEARLY
    );

    if (!yearlyPackage) {
      throw new Error('Yearly package not found');
    }

    const { customerInfo } = await Purchases.purchasePackage(yearlyPackage);
    const isPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

    return { success: true, isPremium };
  } catch (error: any) {
    if (error.userCancelled) {
      console.log('User cancelled purchase');
      return { success: false, isPremium: false };
    }

    console.error('Purchase error:', error);
    throw error;
  }
}

/**
 * Purchase lifetime access
 */
export async function purchaseLifetime(): Promise<{ success: boolean; isPremium: boolean }> {
  try {
    const offerings = await getOfferings();
    
    if (!offerings) {
      throw new Error('No offerings available');
    }

    const lifetimePackage = offerings.availablePackages.find(
      (pkg) => pkg.identifier === ProductIds.LIFETIME
    );

    if (!lifetimePackage) {
      throw new Error('Lifetime package not found');
    }

    const { customerInfo } = await Purchases.purchasePackage(lifetimePackage);
    const isPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

    return { success: true, isPremium };
  } catch (error: any) {
    if (error.userCancelled) {
      console.log('User cancelled purchase');
      return { success: false, isPremium: false };
    }

    console.error('Purchase error:', error);
    throw error;
  }
}

/**
 * Restore purchases
 */
export async function restorePurchases(): Promise<{ success: boolean; isPremium: boolean }> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    const isPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

    return { success: true, isPremium };
  } catch (error) {
    console.error('Restore error:', error);
    throw error;
  }
}

/**
 * Check current premium status
 */
export async function checkPremiumStatus(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
  }
}

/**
 * Login user to RevenueCat
 */
export async function loginUser(userId: string): Promise<void> {
  try {
    await Purchases.logIn(userId);
    console.log('✅ User logged in to RevenueCat:', userId);
  } catch (error) {
    console.error('Error logging in to RevenueCat:', error);
  }
}

/**
 * Logout user from RevenueCat
 */
export async function logoutUser(): Promise<void> {
  try {
    await Purchases.logOut();
    console.log('✅ User logged out from RevenueCat');
  } catch (error) {
    console.error('Error logging out from RevenueCat:', error);
  }
}

export default {
  initializePurchases,
  getOfferings,
  purchaseMonthly,
  purchaseYearly,
  purchaseLifetime,
  restorePurchases,
  checkPremiumStatus,
  loginUser,
  logoutUser,
};
