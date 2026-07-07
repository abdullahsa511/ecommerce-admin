export interface IOrderDetails {
  order_id?: number;
  reference_no: string;
  invoice_no: string;
  customer_order_id: string;
  invoice_prefix: string;
  site_id: string;
  site_name: string;
  total: string;
  order_status_id: string;
  language_id: string;
  currency_id: string;
  currency: string | null;
  currency_value: string | null;
  notes: string | null;
  remote_ip: string | null;
  forwarded_for_ip: string | null;
  user_agent: string | null;
  status: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface ICustomerDetails {
  user_id: string | null;
  user_group_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  total_orders: string;
}

export interface IAccountManagerDetails {
  user_id: string | null;
  user_group_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}
export interface IBillingDetails {
  billing_first_name: string;
  billing_last_name: string;
  billing_company: string | null;
  billing_address_1: string;
  billing_address_2: string | null;
  billing_city: string | null;
  billing_post_code: string | null;
  billing_country_id: string;
  billing_region: string | null;
  billing_region_id: string;
  payment_method: string | null;
  payment_data: string | null;
  payment_status_id: string;
}

export interface IShippingDetails {
  shipping_first_name: string | null;
  shipping_last_name: string | null;
  shipping_company: string | null;
  shipping_address_1: string | null;
  shipping_address_2: string | null;
  shipping_city: string | null;
  shipping_post_code: string | null;
  shipping_country: string | null;
  shipping_country_id: string;
  shipping_region: string | null;
  shipping_region_id: string;
  shipping_method: string | null;
  shipping_data: string | null;
  shipping_status_id: string;
}

export interface IOrderItem {
  order_item_id?: number;
  order_id?: number;
  product_id?: number;
  item_name: string;
  item_description: string;
  item_quantity: number;
  item_unit_price: number;
  item_total: number;
}

export class OrderItem implements IOrderItem {
  order_item_id?: number;
  order_id?: number;
  product_id?: number;
  item_name: string;
  item_description: string;
  item_quantity: number;
  item_unit_price: number;
  item_total: number;

  constructor(data: Partial<IOrderItem> = {}) {
    this.order_item_id = data.order_item_id ?? 0;
    this.order_id = data.order_id ?? 0;
    this.product_id = data.product_id ?? 0;
    this.item_name = data.item_name ?? '';
    this.item_description = data.item_description ?? '';
    this.item_quantity = data.item_quantity ?? 0;
    this.item_unit_price = data.item_unit_price ?? 0;
    this.item_total = data.item_total ?? 0;
  }
}

export interface IOrder {
  order_id?: number;
  orderDetails: IOrderDetails;
  customerDetails: ICustomerDetails;
  billingDetails: IBillingDetails;
  shippingDetails: IShippingDetails;
  accountManagerDetails: IAccountManagerDetails;
  items: OrderItem[];
}


export class Order implements IOrder {
  order_id?: number;
  orderDetails: IOrderDetails;
  customerDetails: ICustomerDetails;
  billingDetails: IBillingDetails;
  shippingDetails: IShippingDetails;
  accountManagerDetails: IAccountManagerDetails;
  items: OrderItem[];

  constructor(data: Partial<IOrder> = {}) {
    this.order_id = data.order_id;
    this.orderDetails = {
      order_id: data?.order_id ?? 0,
      reference_no: data?.orderDetails?.reference_no ?? '',
      invoice_no: data?.orderDetails?.invoice_no ?? '',
      customer_order_id: data?.orderDetails?.customer_order_id ?? '',
      invoice_prefix: data?.orderDetails?.invoice_prefix ?? '',
      site_id: data?.orderDetails?.site_id?.toString() ?? '0',
      site_name: data?.orderDetails?.site_name ?? '',
      total: data?.orderDetails?.total?.toString() ?? '0',
      order_status_id: data?.orderDetails?.order_status_id?.toString() ?? '0',
      status: data?.orderDetails?.status ?? 'Open',
      language_id: data?.orderDetails?.language_id?.toString() ?? '0',
      currency_id: data?.orderDetails?.currency_id?.toString() ?? '0',
      currency: data?.orderDetails?.currency ?? null,
      currency_value: data?.orderDetails?.currency_value?.toString() ?? null,
      notes: data?.orderDetails?.notes ?? null,
      remote_ip: data?.orderDetails?.remote_ip ?? null,
      forwarded_for_ip: data?.orderDetails?.forwarded_for_ip ?? null,
      user_agent: data?.orderDetails?.user_agent ?? null,
      created_at: data?.orderDetails?.created_at ?? null,
      updated_at: data?.orderDetails?.updated_at ?? null
    };

    this.customerDetails = {
      user_id: data?.customerDetails?.user_id?.toString() ?? null,
      user_group_id: data?.customerDetails?.user_group_id?.toString() ?? null,
      first_name: data?.customerDetails?.first_name ?? '',
      last_name: data?.customerDetails?.last_name ?? '',
      email: data?.customerDetails?.email ?? '',
      phone_number: data?.customerDetails?.phone_number ?? '',
      total_orders: '0'
    };

    this.billingDetails = {
      billing_first_name: data?.billingDetails?.billing_first_name ?? '',
      billing_last_name: data?.billingDetails?.billing_last_name ?? '',
      billing_company: data?.billingDetails?.billing_company ?? null,
      billing_address_1: data?.billingDetails?.billing_address_1 ?? '',
      billing_address_2: data?.billingDetails?.billing_address_2 ?? null,
      billing_city: data?.billingDetails?.billing_city ?? null,
      billing_post_code: data?.billingDetails?.billing_post_code ?? null,
      billing_country_id: data?.billingDetails?.billing_country_id?.toString() ?? '0',
      billing_region: data?.billingDetails?.billing_region ?? null,
      billing_region_id: data?.billingDetails?.billing_region_id?.toString() ?? '0',
      payment_method: data?.billingDetails?.payment_method ?? null,
      payment_data: data?.billingDetails?.payment_data ?? null,
      payment_status_id: data?.billingDetails?.payment_status_id?.toString() ?? '0'
    };

    this.shippingDetails = {
      shipping_first_name: data?.shippingDetails?.shipping_first_name ?? null,
      shipping_last_name: data?.shippingDetails?.shipping_last_name ?? null,
      shipping_company: data?.shippingDetails?.shipping_company ?? null,
      shipping_address_1: data?.shippingDetails?.shipping_address_1 ?? null,
      shipping_address_2: data?.shippingDetails?.shipping_address_2 ?? null,
      shipping_city: data?.shippingDetails?.shipping_city ?? null,
      shipping_post_code: data?.shippingDetails?.shipping_post_code ?? null,
      shipping_country: data?.shippingDetails?.shipping_country ?? null,
      shipping_country_id: data?.shippingDetails?.shipping_country_id?.toString() ?? '0',
      shipping_region: data?.shippingDetails?.shipping_region ?? null,
      shipping_region_id: data?.shippingDetails?.shipping_region_id?.toString() ?? '0',
      shipping_method: data?.shippingDetails?.shipping_method ?? null,
      shipping_data: data?.shippingDetails?.shipping_data ?? null,
      shipping_status_id: data?.shippingDetails?.shipping_status_id?.toString() ?? '0'
    };

    this.accountManagerDetails = {
      user_id: data?.accountManagerDetails?.user_id?.toString() ?? null,
      user_group_id: data?.accountManagerDetails?.user_group_id?.toString() ?? null,
      first_name: data?.accountManagerDetails?.first_name ?? '',
      last_name: data?.accountManagerDetails?.last_name ?? '',
      email: data?.accountManagerDetails?.email ?? '',
      phone_number: data?.accountManagerDetails?.phone_number ?? ''
    };
    this.items = [];
  }

  static fromJSON(data: Partial<IOrder>): Order {
    return new Order(data);
  }
} 