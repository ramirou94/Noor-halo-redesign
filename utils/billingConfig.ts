import { Platform } from 'react-native';

export const BILLING_CONFIG = {
  ios: {
    monthlyProductId: process.env.EXPO_PUBLIC_IOS_MONTHLY_PRODUCT_ID || 'com.noorhalo.plus.monthly',
    yearlyProductId: process.env.EXPO_PUBLIC_IOS_YEARLY_PRODUCT_ID || 'com.noorhalo.plus.yearly',
    lifetimeProductId: process.env.EXPO_PUBLIC_IOS_LIFETIME_PRODUCT_ID || 'com.noorhalo.plus.lifetime',
  },
  android: {
    monthlyProductId: process.env.EXPO_PUBLIC_ANDROID_MONTHLY_PRODUCT_ID || 'com.noorhalo.plus.monthly',
    yearlyProductId: process.env.EXPO_PUBLIC_ANDROID_YEARLY_PRODUCT_ID || 'com.noorhalo.plus.yearly',
    lifetimeProductId: process.env.EXPO_PUBLIC_ANDROID_LIFETIME_PRODUCT_ID || 'com.noorhalo.plus.lifetime',
  },
};

export const getProductIds = () => {
  if (Platform.OS === 'ios') {
    return [
      BILLING_CONFIG.ios.monthlyProductId,
      BILLING_CONFIG.ios.yearlyProductId,
      BILLING_CONFIG.ios.lifetimeProductId,
    ];
  } else if (Platform.OS === 'android') {
    return [
      BILLING_CONFIG.android.monthlyProductId,
      BILLING_CONFIG.android.yearlyProductId,
      BILLING_CONFIG.android.lifetimeProductId,
    ];
  }
  return [];
};

export default BILLING_CONFIG;