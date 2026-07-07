export default class Coupon {
  constructor(data = {}) {
    this.coupon_id = data.coupon_id ?? 0;
    this.name = data.name;
    this.code = data.code;
    this.type = data.type;
    this.discount = data.discount;
    this.registered_user_only = data.registered_user_only;
    this.cart_total_min = data.cart_total_min;
    this.date_start = data.date_start;
    this.date_end = data.date_end;
    this.free_shipping = data.free_shipping;
    this.status = data.status;
    this.coupon_limit = data.coupon_limit;
    this.user_limit = data.user_limit;
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

  static fromJSON(data) {
    return new Coupon(data);
  }
}


// export default class Coupon {
//   constructor(data = {}) {
//     this.coupon_id = data.coupon_id ?? 0;
//     this.name = data.name;
//     this.code = data.code;
//     this.type = data.type;
//     this.discount = data.discount;
//     this.total = data.total;
//     this.limit = data.limit;
//     this.limit_user = data.limit_user;
//     this.logged_in = data.logged_in;
//     this.free_shipping = data.free_shipping;
//     this.status = data.status;
//     this.from_date = data.from_date;
//     this.to_date = data.to_date;
//     this.created_at = data.created_at;

//     this.couponDetails = {
//       name: data.couponDetails?.name ?? '',
//       code: data.couponDetails?.code ?? '',
//       discount: data.couponDetails?.discount ?? 0,
//       type: data.couponDetails?.type ?? 'P',
//       free_shipping: data.couponDetails?.free_shipping ?? 0,
//       status: data.couponDetails?.status ?? 1,
//       registered_user_only: data.couponDetails?.registered_user_only ?? 0,
//       cart_total_min: data.couponDetails?.cart_total_min ?? 0,
//       date_start: data.couponDetails?.date_start ?? new Date().toISOString().split('T')[0],
//       date_end: data.couponDetails?.date_end ?? new Date().toISOString().split('T')[0],
//       coupon_limit: data.couponDetails?.coupon_limit ?? 0,
//       user_limit: data.couponDetails?.user_limit ?? 0
//     };

//     this.items = data.items ? data.items : [];
//     this.couponProducts = data.couponProducts ? data.couponProducts : [];
//   }

//   static fromJSON(data) {
//     return new Coupon(data);
//   }
// }


