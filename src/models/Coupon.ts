export interface ICouponDetails {
  name: string;
  code: string;
  discount: number;
  type: 'P' | 'F';
  free_shipping: number;
  status: number;
  registered_user_only: number;
  cart_total_min: number;
  date_start: string;
  date_end: string;
  coupon_limit: number;
  user_limit: number;
}

export interface ICouponProduct {
  coupon_product_id?: number;
  coupon_id?: number;
  product_id?: number;
  item_name: string;
  item_description: string;
  item_quantity: number;
  item_unit_price: number;
  item_total: number;
}

// Interface for the couponProducts data structure used in edit mode
export interface ICouponProductEdit {
  coupon_id: number;
  name: string;
  price: number;
  product_id: number;
  description: string;
}

export class CouponProduct implements ICouponProduct {
  coupon_product_id?: number;
  coupon_id?: number;
  product_id?: number;
  item_name: string;
  item_description: string;
  item_quantity: number;
  item_unit_price: number;
  item_total: number;

  constructor(data: Partial<ICouponProduct> = {}) {
    this.coupon_product_id = data.coupon_product_id ?? 0;
    this.coupon_id = data.coupon_id ?? 0;
    this.product_id = data.product_id ?? 0;
    this.item_name = data.item_name ?? '';
    this.item_description = data.item_description ?? '';
    this.item_quantity = data.item_quantity ?? 0;
    this.item_unit_price = data.item_unit_price ?? 0;
    this.item_total = data.item_total ?? 0;
  }
}

export interface ICoupon {
  coupon_id?: number;
  name?: string;
  code?: string;
  discount?: number | string;
  type?: 'P' | 'F';
  free_shipping?: number;
  status?: number;
  couponDetails: ICouponDetails;
  items: CouponProduct[];
  couponProducts?: ICouponProductEdit[]; // For edit mode
}

export class Coupon implements ICoupon {
  coupon_id?: number;
  name?: string;
  code?: string;
  discount?: number | string;
  type?: 'P' | 'F';
  free_shipping?: number;
  status?: number;
  couponDetails: ICouponDetails;
  items: CouponProduct[];
  couponProducts?: ICouponProductEdit[]; // For edit mode

  constructor(data: any = {}) {
    this.coupon_id = data.coupon_id;
    this.name = data.name;
    this.code = data.code;
    this.discount = data.discount;
    this.type = data.type;
    this.free_shipping = data.free_shipping;
    this.status = data.status;
    this.couponDetails = {
      name: data.couponDetails?.name ?? '',
      code: data.couponDetails?.code ?? '',
      discount: data.couponDetails?.discount ?? 0,
      type: data.couponDetails?.type ?? 'P',
      free_shipping: data.couponDetails?.free_shipping ?? 0,
      status: data.couponDetails?.status ?? 1,
      registered_user_only: data.couponDetails?.registered_user_only ?? 0,
      cart_total_min: data.couponDetails?.cart_total_min ?? 0,
      date_start: data.couponDetails?.date_start ?? new Date().toISOString().split('T')[0],
      date_end: data.couponDetails?.date_end ?? new Date().toISOString().split('T')[0],
      coupon_limit: data.couponDetails?.coupon_limit ?? 0,
      user_limit: data.couponDetails?.user_limit ?? 0
    };
    this.items = data.items ? data.items : [];
    this.couponProducts = data.couponProducts ? data.couponProducts : [];
  }

  static fromJSON(data: Partial<ICoupon>): Coupon {
    return new Coupon(data);
  }
} 
