export interface ICouponDetails {
  name: string;
  code: string;
  discount: number;
  type: 'P' | 'F';
  free_shipping: number;
  status: number;
  registered_user_only: number;
  cart_total_min: number;
  date_start: Date | Date[] | (Date | null)[] | null;
  date_end: Date | Date[] | (Date | null)[] | null;
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
  type?: 'P' | 'F';
  discount?: null;
  total?: null;
  limit?: null;
  limit_user?:null;
  logged_in?:null;
  free_shipping?: number;
  status?: number;
  from_date?: null;
  to_date?: null;
  created_at?: number | string;

  couponDetails: ICouponDetails;
  items: CouponProduct[];
  couponProducts?: ICouponProductEdit[]; // For edit mode
}

export class Coupon implements ICoupon {
  coupon_id?: number;
  name?: string;
  code?: string;
  type?: 'P' | 'F';
  discount?: null;
  total?: null;
  limit?: null;
  limit_user?: null;
  logged_in?: null;
  free_shipping?: number;
  status?: number;
  from_date?: null;
  to_date?: null;
  created_at?: number | string;
  couponDetails: ICouponDetails;
  items: CouponProduct[];
  couponProducts?: ICouponProductEdit[]; // For edit mode

  constructor(data: any = {}) {
    this.coupon_id = data.coupon_id ?? 0;
    this.name = data.name;
    this.code = data.code;
    this.type = data.type;
    this.discount = data.discount;
    this.total = data.total;
    this.limit = data.limit;
    this.limit_user = data.limit_user;
    this.logged_in = data.logged_in;
    this.free_shipping = data.free_shipping;
    this.status = data.status;
    this.from_date = data.from_date;
    this.to_date = data.to_date;
    this.created_at = data.created_at;
    
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

  // static fromJSON(data: Partial<ICoupon>): Coupon {
  //   return new Coupon(data);
  // }
  // static default(): Coupon {
  //   return new Coupon({
  //     coupon_id: 0,
  //     name: '',
  //     code: '',
  //     type: 'P',
  //     discount: 0,
  //     total: 0,
  //     limit: 0,
  //     limit_user: 0,
  //     logged_in: 0,
  //     free_shipping: 0,
  //     status: 1,
  //     from_date: '',
  //     to_date: '',
  //     created_at: '',
  
  //     couponDetails: {
  //       name: '',
  //       code: '',
  //       discount: 0,
  //       type: 'P',
  //       free_shipping: 0,
  //       status: 1,
  //       registered_user_only: 0,
  //       cart_total_min: 0,
  //       date_start: new Date().toISOString().split('T')[0],
  //       date_end: new Date().toISOString().split('T')[0],
  //       coupon_limit: 0,
  //       user_limit: 0
  //     },
  
  //     items: [],
  //     couponProducts: []
  //   });
  // }
  
} 