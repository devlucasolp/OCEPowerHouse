export interface Coupon {
  _id: string;
  _type: 'coupon';
  code: string;
  title: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  usageLimit: number;
  usageCount: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  applicableCategories?: string[];
  excludedProducts?: string[];
}

export interface CouponValidationResult {
  isValid: boolean;
  error?: string;
  discountAmount?: number;
}

export interface CouponApplication {
  coupon: Coupon;
  discountAmount: number;
  finalPrice: number;
} 