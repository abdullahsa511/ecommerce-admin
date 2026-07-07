export interface IPinboardStatus {
  order_status_id: number;
  language_id: number;
  name: string;
  sort_order: number;
}

export class PinboardStatus implements IPinboardStatus {
  order_status_id: number;
  language_id: number;
  name: string;
  sort_order: number;

  constructor(data: Partial<IPinboardStatus> = {}) {
    this.order_status_id = data.order_status_id ?? 0;
    this.language_id = data.language_id ?? 1;
    this.name = data.name ?? '';
    this.sort_order = data.sort_order ?? 0;
  }
}

export interface IPinboardDetails {
  referenceNumber: string;
  pinboard_status_id: number;
  pinboard_status_name: string;
  pinboardName: string;
  createdByCompany: string;
  dispatchLocation: string;
  jobTitle: string;
  pinboardDescription: string;
  accountManager: string;
  projectManager: string;
  createdBy: string;
  customerPO: string;
  expiryDate: string;
  created_at: string;
}

export interface ICustomerDetails {
  customer_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
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

export interface IPinboardTotals {
  salesPriceList: string;
  totalBpExGst: string;
  totalBpIncGst: string;
  totalSpExGst: string;
  totalSpIncGst: string;
  orderDiscount: string;
  discountAmount: string;
  grandTotalSpExGst: string;
  grandTotalSpIncGst: string;
}

export interface IBillingAddress {
  instructions: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
}

export interface IShippingAddress {
  buildingName: string;
  instructions: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
}

export interface IPinboardItem {
  pinboard_item_id?: number;
  pinboard_temp_item_id?: number;
  pinboard_temp_id?: number;
  pinboard_id?: number;
  product_id?: number;
  project_id?: number;
  comment_id?: number;
  blog_post_id?: number;
  media_id?: number;
  item_type: 'product' | 'project' | 'comment' | 'blog_post' | 'media';
  item_name: string;
  item_description: string;
  item_quantity: number;
  item_unit_price: number;
  item_total: number;
  item_data?: any;
  title: string;
}

// Interface for the itemProducts data structure used in edit mode
export interface IItemProductEdit {
  pinboard_id: number;
  product_id: number;
  type: string;
  product_name: string;
  product_description: string;
  product_price: number;
  product_content: string;
}

// Interface for Project items
export interface IItemProjectEdit {
  pinboard_id: number;
  project_id: number;
  type: string;
  project_description: string;
  project_image: string;
  project_name: string;
}

// Interface for Comment items
export interface IItemCommentEdit {
  pinboard_id: number;
  comment_id: number;
  type: string;
  comment_author: string;
  comment_content: string;
}

// Interface for Blog Post items
export interface IItemBlogPostEdit {
  pinboard_id: number;
  type: string;
  post_id: number;
  post_description: string;
  post_image: string;
  post_type: string;
  post_name: string;
  post_content: string;
  post_excerpt: string;
}

// Interface for Media items
export interface IItemMediaEdit {
  pinboard_id: number;
  type: string;
  media_id: number;
  media_name: string;
  media_file: string;
  media_type: string;
  media_meta: any;
}

// Union type for all item types
export type IItemEdit = IItemProductEdit | IItemProjectEdit | IItemCommentEdit | IItemBlogPostEdit | IItemMediaEdit;

export class PinboardItem implements IPinboardItem {
  pinboard_item_id?: number;
  pinboard_temp_item_id?: number;
  pinboard_temp_id?: number;
  pinboard_id?: number;
  product_id?: number;
  project_id?: number;
  comment_id?: number;
  blog_post_id?: number;
  media_id?: number;
  item_type: 'product' | 'project' | 'comment' | 'blog_post' | 'media';
  item_name: string;
  item_description: string;
  item_quantity: number;
  item_unit_price: number;
  item_total: number;
  item_data?: any;
  title: string;

  constructor(data: Partial<IPinboardItem> = {}) {
    this.pinboard_item_id = data.pinboard_item_id ?? 0;
    this.pinboard_id = data.pinboard_id ?? 0;
    this.pinboard_temp_item_id = data.pinboard_temp_item_id ?? 0;
    this.pinboard_temp_id = data.pinboard_temp_id ?? 0;
    this.product_id = data.product_id ?? 0;
    this.project_id = data.project_id ?? 0;
    this.comment_id = data.comment_id ?? 0;
    this.blog_post_id = data.blog_post_id ?? 0;
    this.media_id = data.media_id ?? 0;
    this.item_type = data.item_type ?? 'product';
    this.item_name = data.item_name ?? '';
    this.item_description = data.item_description ?? '';
    this.item_quantity = data.item_quantity ?? 0;
    this.item_unit_price = data.item_unit_price ?? 0;
    this.item_total = data.item_total ?? 0;
    this.item_data = data.item_data ?? null;
    this.title = data.title ?? '';
  }
}

export interface IPinboard {
  pinboard_id?: number;
  pinboard_temp_id?:number;
  pinboard_temp_item_id?:number;
  pinboard_temp_item_accessories_id?:number;
  item_count: number;
  pinboard_status: IPinboardStatus;
  pinboardDetails: IPinboardDetails;
  customerDetails: ICustomerDetails;
  pinboardTotals: IPinboardTotals;
  billingAddress: IBillingAddress;
  shippingAddress: IShippingAddress;
  items: PinboardItem[];
  pinboardItems?: IItemEdit[]; // For backend response - now supports all item types
}

export class Pinboard implements IPinboard {
  pinboard_id?: number;
  pinboard_temp_id?:number;
  pinboard_temp_item_id?:number;
  pinboard_temp_item_accessories_id?:number;
  item_count: number;
  pinboard_status: PinboardStatus;
  pinboardDetails: IPinboardDetails;
  customerDetails: ICustomerDetails;
  pinboardTotals: IPinboardTotals;
  billingAddress: IBillingAddress;
  shippingAddress: IShippingAddress;
  items: PinboardItem[];
  pinboardItems?: IItemEdit[]; // For backend response - now supports all item types

  constructor(data: any = {}) {
    this.pinboard_id = data.pinboard_id;
    this.pinboard_temp_id = data.pinboard_temp_id;
    this.pinboard_temp_item_id = data.pinboard_temp_item_id;
    this.pinboard_temp_item_accessories_id = data.pinboard_temp_item_accessories_id;
    this.item_count = data.item_count ?? 0;
    const statusData = data.pinboard_status ?? data.pinboardDetails?.pinboard_status ?? null;
    this.pinboard_status = new PinboardStatus(statusData ?? {});
    
    // Handle both flat backend data (snake_case) and nested data (camelCase)
    this.pinboardDetails = {
      referenceNumber: data.pinboardDetails?.referenceNumber ?? data.reference_number ?? '',
      pinboard_status_id: data.pinboardDetails?.pinboard_status_id ?? data.pinboard_status_id ?? this.pinboard_status.order_status_id ?? 0,
      pinboard_status_name: data.pinboardDetails?.pinboard_status_name ?? data.pinboard_status_name ?? this.pinboard_status.name ?? '',
      pinboardName: data.pinboardDetails?.pinboardName ?? data.pinboard_name ?? '',
      createdByCompany: data.pinboardDetails?.createdByCompany ?? data.company_id ?? '',
      dispatchLocation: data.pinboardDetails?.dispatchLocation ?? data.dispatch_location_id ?? '',
      jobTitle: data.pinboardDetails?.jobTitle ?? data.job_title ?? '',
      pinboardDescription: data.pinboardDetails?.pinboardDescription ?? data.pinboard_description ?? '',
      accountManager: data.pinboardDetails?.accountManager ?? data.account_manager_id ?? '',
      projectManager: data.pinboardDetails?.projectManager ?? data.project_manager_id ?? '',
      createdBy: data.pinboardDetails?.createdBy ?? data.user_id ?? '',
      customerPO: data.pinboardDetails?.customerPO ?? data.customer_po_number ?? '',
      expiryDate: data.pinboardDetails?.expiryDate ?? data.expiry_date ?? '',
      created_at: data.pinboardDetails?.created_at ?? data.created_at ?? ''
    };
    
    this.customerDetails = {
      customer_id: data.customerDetails?.customerId ?? data.customerId ?? 0,
      customer_name: data.customerDetails?.customer_name ?? data.customer_name ?? '',
      customer_email: data.customerDetails?.customer_email ?? data.customer_email ?? '',
      customer_phone: data.customerDetails?.customer_phone ?? data.customer_phone ?? '',
      organisationCode: data.customerDetails?.organisationCode ?? data.organisation_code ?? '',
      organisationName: data.customerDetails?.organisationName ?? data.organisation_name ?? '',
      zohoId: data.customerDetails?.zohoId ?? data.zoho_id ?? '',
      terms: data.customerDetails?.terms ?? data.terms ?? '',
      deposit: data.customerDetails?.deposit ?? data.deposit_percentage ?? '',
      gst: data.customerDetails?.gst ?? data.gst ?? '',
      billTo: data.customerDetails?.billTo ?? data.bill_to ?? '',
      shipTo: data.customerDetails?.shipTo ?? data.ship_to ?? '',
      siteContacts: data.customerDetails?.siteContacts ?? data.site_contacts ?? '',
      customerBalance: data.customerDetails?.customerBalance ?? data.customer_balance ?? '',
    };
    
    this.pinboardTotals = {
      salesPriceList: data.pinboardTotals?.salesPriceList ?? data.sales_price_list ?? '',
      totalBpExGst: data.pinboardTotals?.totalBpExGst ?? data.total_bp_ex_gst ?? '',
      totalBpIncGst: data.pinboardTotals?.totalBpIncGst ?? data.total_bp_inc_gst ?? '',
      totalSpExGst: data.pinboardTotals?.totalSpExGst ?? data.total_sp_ex_gst ?? '',
      totalSpIncGst: data.pinboardTotals?.totalSpIncGst ?? data.total_sp_inc_gst ?? '',
      orderDiscount: data.pinboardTotals?.orderDiscount ?? data.order_discount ?? '',
      discountAmount: data.pinboardTotals?.discountAmount ?? data.discount_amount ?? '',
      grandTotalSpExGst: data.pinboardTotals?.grandTotalSpExGst ?? data.grand_total_sp_ex_gst ?? '',
      grandTotalSpIncGst: data.pinboardTotals?.grandTotalSpIncGst ?? data.grand_total_sp_inc_gst ?? ''
    };
    
    this.billingAddress = {
      instructions: data.billingAddress?.instructions ?? data.bill_instructions ?? '',
      address: data.billingAddress?.address ?? data.bill_address ?? '',
      suburb: data.billingAddress?.suburb ?? data.bill_suburb ?? '',
      state: data.billingAddress?.state ?? data.bill_state ?? '',
      postcode: data.billingAddress?.postcode ?? data.bill_postcode ?? '',
      country: data.billingAddress?.country ?? data.bill_country ?? ''
    };
    
    this.shippingAddress = {
      buildingName: data.shippingAddress?.buildingName ?? data.ship_building_name ?? '',
      instructions: data.shippingAddress?.instructions ?? data.ship_instructions ?? '',
      address: data.shippingAddress?.address ?? data.ship_address ?? '',
      suburb: data.shippingAddress?.suburb ?? data.ship_suburb ?? '',
      state: data.shippingAddress?.state ?? data.ship_state ?? '',
      postcode: data.shippingAddress?.postcode ?? data.ship_postcode ?? '',
      country: data.shippingAddress?.country ?? data.ship_country ?? ''
    };

    this.items = data.items ? data.items : [];
    this.pinboardItems = data.pinboard_item ? data.pinboard_item : [];
  }

  static fromJSON(data: Partial<IPinboard>): Pinboard {
    return new Pinboard(data);
  }
} 