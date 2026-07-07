export interface ICustomer {
  uuid: string;
  customer_id: number;
  user_id: number;
  org_code: string;
  username: string;
  name: string;
  gmail_Id: string;
  email: string;
  phone: string;
  address: string;
}

export class Customer implements ICustomer {        
    uuid: string;
    customer_id: number;
    org_code: string;
    name: string;
    user_id: number;
    username: string;
    gmail_Id: string;
    email: string;
    phone: string;
    address: string;

    constructor(data: Partial<ICustomer> = {}) {
        this.uuid = data.uuid ?? '';
        this.customer_id = data.customer_id ?? data.user_id ?? 0;
        this.org_code = data.org_code ?? '';
        this.name = data.name ?? '';
        this.user_id = data.user_id ?? 0;
        this.username = data.username ?? '';
        this.gmail_Id = data.gmail_Id ?? '';
        this.email = data.email ?? '';
        this.phone = data.phone ?? '';
        this.address = data.address ?? '';
    }
}

export interface ICustomerDetails {
  user_id: number | null;
  user_group_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  total_orders: string;
  organisationCode: string;
  organisationName: string;
  zohoId: string;
  terms: string;
  deposit: string;
  gst: string;
  billTo: string;
  shipTo: string;
  siteContacts: string;
  customerBalance: string;
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

export interface ICustomerData {
  name?: string;
  customerDetails: ICustomerDetails;
  billingDetails: IBillingDetails;
  shippingDetails: IShippingDetails;
}

export class CustomerData implements ICustomerData {
  name: string;
  customerDetails: ICustomerDetails;
  billingDetails: IBillingDetails;
  shippingDetails: IShippingDetails;

  constructor(data: Record<string, any> = {}) {
    const toString = (value: any, defaultValue = '0') =>
      value !== undefined && value !== null ? value.toString() : defaultValue;
  
    this.name = data.customer?.name ?? '';
  
    this.customerDetails = {
      user_id: data.customer?.user_id ?? null,
      user_group_id: data.customer?.user_group_id ?? null,
      first_name: data.customer?.first_name ?? '',
      last_name: data.customer?.last_name ?? '',
      email: data.customer?.email ?? '',
      phone_number: data.customer?.phone_number ?? '',
      total_orders: '0',
      organisationCode: data.customer?.organisationCode ?? 'CUST-001',
      organisationName: data.customer?.organisationName ?? 'Tech Solutions Pty Ltd',
      zohoId: data.customer?.zohoId ?? '20250124000000000000000000000000',
      terms: data.customer?.terms ?? 'Net 30',
      deposit: data.customer?.deposit ?? '30',
      gst: data.customer?.gst ?? '10',
      billTo: data.customer?.billTo ?? '23, Treeton Street, Pimlico, Australia',
      shipTo: data.customer?.shipTo ?? '23, Treeton Street, Pimlico, Australia',
      siteContacts: data.customer?.siteContacts ?? 'Michael Brown (0400 123 456)',
      customerBalance: data.customer?.customerBalance ?? '0.00'
    };
  
    this.billingDetails = {
      billing_first_name: data.billingAddress?.first_name ?? '',
      billing_last_name: data.billingAddress?.last_name ?? '',
      billing_company: data.billingAddress?.company ?? null,
      billing_address_1: data.billingAddress?.address_1 ?? '',
      billing_address_2: data.billingAddress?.address_2 ?? null,
      billing_city: data.billingAddress?.city ?? null,
      billing_post_code: data.billingAddress?.post_code ?? null,
      billing_country_id: toString(data.billingAddress?.country_id),
      billing_region: null,
      billing_region_id: toString(data.billingAddress?.region_id),
      payment_method: null,
      payment_data: null,
      payment_status_id: '0'
    };
  
    this.shippingDetails = {
      shipping_first_name: data.shippingAddress?.first_name ?? null,
      shipping_last_name: data.shippingAddress?.last_name ?? null,
      shipping_company: data.shippingAddress?.company ?? null,
      shipping_address_1: data.shippingAddress?.address_1 ?? null,
      shipping_address_2: data.shippingAddress?.address_2 ?? null,
      shipping_city: data.shippingAddress?.city ?? null,
      shipping_post_code: data.shippingAddress?.post_code ?? null,
      shipping_country: null,
      shipping_country_id: toString(data.shippingAddress?.country_id),
      shipping_region: null,
      shipping_region_id: toString(data.shippingAddress?.region_id),
      shipping_method: null,
      shipping_data: null,
      shipping_status_id: '0'
    };
  }

  static fromJSON(data: Partial<ICustomerData>): CustomerData {
    return new CustomerData(data);
  }

  toJSON(): ICustomerData {
    return {
      name: this.name,
      customerDetails: this.customerDetails,
      billingDetails: this.billingDetails,
      shippingDetails: this.shippingDetails
    };
  }
}
