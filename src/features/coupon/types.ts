export type CouponType = "FIXED_AMOUNT" | "PERCENTAGE";

export interface UserCoupon {
  couponName: string;
  couponType: CouponType;
  value: number;
  used: boolean;
  expired: boolean;
  expiredAt: string;
}

export interface AvailableCoupon {
  couponId: number;
  couponCode: string;
  couponName: string;
  couponType: CouponType;
  value: number;
  validTo: string;
}

export interface MyCouponsResponse {
  coupons: UserCoupon[];
}

export interface AvailableCouponsResponse {
  coupons: AvailableCoupon[];
}

export interface ClaimCouponRequest {
  couponCode: string;
}

export interface ClaimCouponResponse {
  userId: number;
  couponId: number;
  userCouponId: number;
}
