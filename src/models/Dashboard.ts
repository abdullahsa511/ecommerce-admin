import { IFileModel } from "./Media";

export interface CardData {
  card_type: string;
  title: string;
  analytics: string;
  value: string;
  percent: string;
}

/**
 * Parsed weekly revenue item
 */
export interface RevenueDataPoint {
  label: string;   // "1 week 2025-10-27 - 2025-11-02"
  amount: number; // 7837.5
}

export interface IRevenueCardWidget {
  cardData: CardData;
  borderColor?: string;
  bgColor?: string[] | null;
  data: RevenueDataPoint[];
}

export class RevenueCardWidget implements IRevenueCardWidget {
  cardData: CardData;
  borderColor?: string;
  bgColor?: string[] | null;
  data: RevenueDataPoint[];

  constructor(payload: Partial<IRevenueCardWidget & { data: string[] }> = {}) {
    // console.log('RevenueCardWidget payload:', payload);

    this.cardData = payload.cardData ?? {
      card_type: '',
      title: '',
      analytics: '',
      value: '',
      percent: '',
    };

    this.borderColor = payload.borderColor || undefined;
    this.bgColor = payload.bgColor ?? null;

    this.data = Array.isArray(payload.data)
      ? payload.data.map(this.parseRevenueString)
      : [];
  }

  /**
   * Convert API string into structured data
   * "1 week ... / AUD 7837.50"
   */
  private parseRevenueString(item: string): RevenueDataPoint {
    const [labelPart, amountPart] = item.split('/');

    const amount = parseFloat(
      amountPart?.replace(/[^\d.]/g, '') ?? '0'
    );

    return {
      label: labelPart?.trim() ?? '',
      amount: isNaN(amount) ? 0 : amount,
    };
  }
}
export interface IOverviewCategories {
  category_id: number;
  parent_id: number,
  parent_name: string,
  product_category: string,
  total_amount: string;
}
// Overview Widget
export interface IOverviewWidget {
  week: string;
  total_amount: string;
  categories: IOverviewCategories[];
}

export class OverviewWidget implements IOverviewWidget {
  week: string;
  total_amount: string;
  categories: IOverviewCategories[];
  constructor(data: Partial<IOverviewWidget> = {}) {
    this.week = data.week ?? '';
    this.total_amount = data.total_amount ?? '';
    this.categories = data.categories ?? [] as IOverviewCategories[];
  }
  static fromJSON(json: Partial<IOverviewWidget>): OverviewWidget {
    return new OverviewWidget(json);
  }
}

// Recent Activities Widget
export interface IRecentActivitiesWidget {
  pinboard_id: number;
  date: string;
  amount: string;
  user_name: string;
  avatar: string;
  customer_name: string;
  status: string;
}

export class RecentActivitiesWidget implements IRecentActivitiesWidget {
  pinboard_id: number;
  date: string;
  amount: string;
  user_name: string;
  avatar: string;
  customer_name: string;
  status: string;

  constructor(data: Partial<IRecentActivitiesWidget> = {}) {
    // console.log('this is recent activities widget model data',data);
    this.pinboard_id = data.pinboard_id ?? 0;
    this.date = data.date ?? '';
    this.user_name = data.user_name ?? '';
    this.avatar = data.avatar ?? '';
    this.customer_name = data.customer_name ?? '';
    this.amount = data.amount ?? '';
    this.status = data.status ?? '';
  }

  static fromJSON(json: Partial<IRecentActivitiesWidget>): RecentActivitiesWidget {
    return new RecentActivitiesWidget(json);
  }
}

type ThemeColor = 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'teal' | 'cyan' | 'pink' | 'indigo' | 'yellow';

const generateColorNameFromString = (str: string): ThemeColor => {
  const colors: ThemeColor[] = [
    'blue',
    'green',
    'purple',
    'red',
    'orange',
    'teal',
    'cyan',
    'pink',
    'indigo',
    'yellow'
  ];

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

export interface IRecentQuotesWidget {
  // // Quote Reference, Description, Customer, Status, Created Date, Updated Date, Amount
  id: number;
  customer_name: string;
  name: {
    value: string;
    bgColor: string;
    capName: string;
  };
  account: string;
  reference: string;
  description: string;
  date: string;
  amount: string;
  status: string;
  updated_at: string;
}

export class RecentQuotesWidget implements IRecentQuotesWidget {
  id: number;
  customer_name: string;
  name: {
    value: string;
    bgColor: string;
    capName: string;
  };
  account: string;
  reference: string;
  description: string;
  date: string;
  amount: string;
  status: string;
  updated_at: string;

  constructor(data: Partial<IRecentQuotesWidget> = {}) {
    // console.log('this is recent quotes widget model data',data);
    this.id = data.id ?? 0;
    this.customer_name = data.customer_name ?? '';
    this.name = data.customer_name ?
      {
        value: this.customer_name,
        bgColor: generateColorNameFromString(this.customer_name),
        capName: this.customer_name
          ? this.customer_name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
          : ''
      } :
      { value: '', bgColor: 'blue', capName: 'AM' };
    this.account = data.account ?? data.account ?? '';
    this.reference = data.reference ?? data.reference ?? '';
    this.description = data.description ?? data.description ?? '';
    this.date = data.date ?? data.date ?? '';
    this.amount = data.amount ?? data.amount ?? '';
    this.status = data.status ?? data.status ?? '';
    this.updated_at = data.updated_at ?? data.updated_at ?? '';
  }
  static fromJSON(json: Partial<IRecentQuotesWidget>): RecentQuotesWidget {
    return new RecentQuotesWidget(json);
  }
}

// RecentOrdersWidget
export interface IRecentOrdersWidget {
  customer_name: string;
  order_reference: string;
  order_description: string;
  date: string;
  amount: string;
  manager_name: string;
  updated_at: string;
  status: string;
}

export class RecentOrdersWidget implements IRecentOrdersWidget {
  customer_name: string;
  order_reference: string;
  order_description: string;
  date: string;
  amount: string;
  manager_name: string;
  updated_at: string;
  status: string;
  constructor(data: Partial<IRecentOrdersWidget> = {}) {
    this.customer_name = data.customer_name ?? '';
    this.order_reference = data.order_reference ?? '';
    this.order_description = data.order_description ?? '';
    this.date = data.date ?? '';
    this.amount = data.amount ?? '';
    this.manager_name = data.manager_name ?? '';
    this.updated_at = data.updated_at ?? '';
    this.status = data.status ?? '';
  }

  static fromJSON(json: Partial<IRecentOrdersWidget>): RecentOrdersWidget {
    return new RecentOrdersWidget(json);
  }
}

// RevenuePinboardDetails

export interface IRevenuePinboardDetails {
  id: number;
  reference: string;
  total: string;
  description: string;
  avatar: string;
  customer_name: string | null;
  created_at: string;
  updated_at: string;
  status: string;
}

export class RevenuePinboardDetails implements IRevenuePinboardDetails {
  id: number;
  reference: string;
  total: string;
  description: string;
  avatar: string;
  customer_name: string | null;
  created_at: string;
  updated_at: string;
  status: string;

  constructor(data: Partial<IRevenuePinboardDetails> = {}) {
    this.id = data.id ?? 0;
    this.reference = data.reference ?? '';
    this.total = data.total ?? '';
    this.description = data.description ?? '';
    this.avatar = data.avatar ?? '';
    this.customer_name = data.customer_name ?? null;
    this.created_at = data.created_at ?? data.created_at ?? '';
    this.updated_at = data.updated_at ?? data.updated_at ?? '';
    this.status = data.status ?? data.status ?? '';
  }

  static fromJSON(json: Partial<IRevenuePinboardDetails>): RevenuePinboardDetails {
    return new RevenuePinboardDetails(json);
  }
}

// TransactionDetailsWidget
export interface IItems{
  quote_item_id: number;
  language_id: number;
  uuid: number;
  quote_id: number;
  product_id: number;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  photo: IFileModel[] | [];
  sort_order: number;
  created_at: string;
  updated_at: string;
  product_code: string;
  product_price: number | null;
  image_url: string;
}
export interface ITransactionDetailsWidget {
  id: number;
  customer_name: string;
  reference: string;
  description: string;
  date: string;
  amount: string;
  manager_name: string;
  updated_at: string;
  status: string;
  items: IItems[];
}

export class TransactionDetailsWidget implements ITransactionDetailsWidget {  
  id: number;
  customer_name: string;
  reference: string;
  description: string;
  date: string;
  amount: string;
  manager_name: string;
  updated_at: string;
  status: string;
  items: IItems[];
  constructor(data: Partial<ITransactionDetailsWidget> = {}) {
    this.id = data.id ?? 0;
    this.customer_name = data.customer_name ?? '';
    this.reference = data.reference ?? '';
    this.description = data.description ?? '';
    this.date = data.date ?? '';
    this.amount = data.amount ?? '';
    this.manager_name = data.manager_name ?? '';
    this.updated_at = data.updated_at ?? '';
    this.status = data.status ?? '';
    this.items = data.items ?? [] as IItems[];
  }
  static fromJSON(json: Partial<ITransactionDetailsWidget>): TransactionDetailsWidget {
    return new TransactionDetailsWidget(json);
  }
}