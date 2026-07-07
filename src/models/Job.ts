export interface IOrder {
  total: number;
  order_id: number;
  created_at: string;
  updated_at: string;
  order_status_id: number;
  reference_number: string;
  order_description: string;
}

export interface IQuote {
  total: number;
  quote_id: number;
  created_at: string;
  updated_at: string;
  quote_status_id: number;
  reference_number: string;
  quote_description: string;
}

export interface IJob {
  job_id?: number;
  language_id?: number;
  type?: string;
  reference?: string;
  job_title?: string;
  description?: string;
  company?: string;
  account_manager_id?: number;
  account_manager_name?: string;
  status?: string;
  value?: any;
  orders?: IOrder[];
  quotes?: IQuote[];
  created_at?: string;
  updated_at?: string;
}

export class Job implements IJob {
  job_id?: number;
  language_id?: number;
  type?: string;
  reference?: string;
  job_title?: string;
  description?: string;
  company?: string;
  account_manager_id?: number;
  account_manager_name?: string;
  status?: string;
  value?: any;
  orders?: IOrder[];
  quotes?: IQuote[];
  created_at?: string;
  updated_at?: string;

  constructor(data: Partial<IJob> = {}) {
    this.job_id = data.job_id;
    this.language_id = 1;
    this.type = data.type ?? '';
    this.reference = data.reference ?? '';
    this.job_title = data.job_title ?? '';
    this.description = data.description ?? '';
    this.company = data.company ?? '';
    this.account_manager_id = data.account_manager_id;
    this.account_manager_name = data.account_manager_name ?? '';
    this.status = data.status ?? '';
    this.value = data.value ?? '0.00';
    this.orders = data.orders ?? [];
    this.quotes = data.quotes ?? [];
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }


  static fromJSON(data: Partial<IJob>): Job {
    return new Job(data);
  }
}