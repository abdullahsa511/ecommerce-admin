import { FileModel, IFileModel } from "./Media.ts";

export interface IQuoteDetails {
  referenceNumber: string;
  createdByCompany: string;
  dispatchLocation: string;
  jobTitle: string;
  quoteDescription: string;
  accountManager: string;
  projectManager: string;
  createdBy: string;
  customerPO: string;
  expiryDate: string;
  customerName: string;
  location: string;
}

export interface ICustomerDetails {
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

export interface IQuoteTotals {
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
}

export interface IQuoteItem {
  // quote_item_id?: number;
  // quote_id?: number;
  // product_id?: number;
  // item_name: string;
  // item_description: string;
  // item_quantity: number;
  // item_unit_price: number;
  // item_total: number;

  quote_item_id?: number;
  language_id?: number;
  uuid?: number;
  quote_id?: number;
  product_id?: number;
  item_name: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  photo: IFileModel[] | [];
  sort_order: number;
}


export class QuoteItem implements IQuoteItem {
  // quote_item_id?: number;
  // quote_id?: number;
  // product_id?: number;
  // item_name: string;
  // item_description: string;
  // item_quantity: number;
  // item_unit_price: number;
  // item_total: number;
  quote_item_id?: number;
  language_id?: number;
  uuid?: number;
  quote_id?: number;
  product_id?: number;
  item_name: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  photo: IFileModel[] | [];
  sort_order: number;

  constructor(data: Partial<IQuoteItem> = {}) {
    this.quote_item_id = data.quote_item_id ?? 0;
    this.quote_id = data.quote_id ?? 0;
    this.product_id = data.product_id ?? 0;
    this.item_name = data.item_name ?? '';
    this.description = data.description ?? '';
    this.quantity = data.quantity ?? 0;
    this.unit_price = data.unit_price ?? 0;
    this.total_price = data.total_price ?? 0;
    this.photo = data.photo ?? [];
    this.sort_order = data.sort_order ?? 0;
    
  }
}

export interface IQuote {
  quote_id?: number;
  quoteDetails: IQuoteDetails;
  customerDetails: ICustomerDetails;
  quoteTotals: IQuoteTotals;
  billingAddress: IBillingAddress;
  shippingAddress: IShippingAddress;
  items: QuoteItem[];
}

export default class Quote implements IQuote {
  quote_id?: number;
  quoteDetails: IQuoteDetails;
  customerDetails: ICustomerDetails;
  quoteTotals: IQuoteTotals;
  billingAddress: IBillingAddress;
  shippingAddress: IShippingAddress;
  items: QuoteItem[];

  constructor(data: Partial<IQuote> = {}) {
    this.quote_id = data.quote_id;
    this.quoteDetails = {
      referenceNumber: data.quoteDetails?.referenceNumber ?? '',
      createdByCompany: data.quoteDetails?.createdByCompany ?? '',
      dispatchLocation: data.quoteDetails?.dispatchLocation ?? '',
      jobTitle: data.quoteDetails?.jobTitle ?? '',
      quoteDescription: data.quoteDetails?.quoteDescription ?? '',
      accountManager: data.quoteDetails?.accountManager ?? '',
      projectManager: data.quoteDetails?.projectManager ?? '',
      createdBy: data.quoteDetails?.createdBy ?? '',
      customerPO: data.quoteDetails?.customerPO ?? '',
      expiryDate: data.quoteDetails?.expiryDate ?? '',
      customerName: data.quoteDetails?.customerName ?? '',
      location: data.quoteDetails?.location ?? ''

    };
    this.customerDetails = {
      organisationCode: data.customerDetails?.organisationCode ?? '',
      organisationName: data.customerDetails?.organisationName ?? '',
      zohoId: data.customerDetails?.zohoId ?? '',
      terms: data.customerDetails?.terms ?? '',
      deposit: data.customerDetails?.deposit ?? '',
      gst: data.customerDetails?.gst ?? '',
      billTo: data.customerDetails?.billTo ?? '',
      shipTo: data.customerDetails?.shipTo ?? '',
      siteContacts: data.customerDetails?.siteContacts ?? '',
      customerBalance: data.customerDetails?.customerBalance ?? ''
    };
    this.quoteTotals = {
      salesPriceList: data.quoteTotals?.salesPriceList ?? '',
      totalBpExGst: data.quoteTotals?.totalBpExGst ?? '',
      totalBpIncGst: data.quoteTotals?.totalBpIncGst ?? '',
      totalSpExGst: data.quoteTotals?.totalSpExGst ?? '',
      totalSpIncGst: data.quoteTotals?.totalSpIncGst ?? '',
      orderDiscount: data.quoteTotals?.orderDiscount ?? '',
      discountAmount: data.quoteTotals?.discountAmount ?? '',
      grandTotalSpExGst: data.quoteTotals?.grandTotalSpExGst ?? '',
      grandTotalSpIncGst: data.quoteTotals?.grandTotalSpIncGst ?? ''
    };
    this.billingAddress = {
      instructions: data.billingAddress?.instructions ?? '',
      address: data.billingAddress?.address ?? '',
      suburb: data.billingAddress?.suburb ?? '',
      state: data.billingAddress?.state ?? '',
      postcode: data.billingAddress?.postcode ?? '',
      country: data.billingAddress?.country ?? ''
    };
    this.shippingAddress = {
      buildingName: data.shippingAddress?.buildingName ?? '',
      instructions: data.shippingAddress?.instructions ?? '',
      address: data.shippingAddress?.address ?? ''
    };

    this.items = data.items ? data.items : [];
  }

  static fromJSON(data: Partial<IQuote>): Quote {
    return new Quote(data);
  }
}