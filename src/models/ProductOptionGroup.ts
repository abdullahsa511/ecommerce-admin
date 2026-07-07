export interface IProductOptionGroup {
  product_option_group_id?: number | null;
  product_variant_id?: number | null;
  product_id?: number | null;
  variant_name?: string | null;
  option_group_name?: string | null;
  sort_order?: string;
  active_status?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export default class ProductOptionGroup implements IProductOptionGroup {
  product_option_group_id: number | null;
  product_variant_id: number | null;
  product_id: number | null;
  variant_name: string | null;
  option_group_name: string | null;
  sort_order: string;
  active_status: boolean | null;
  created_at: string | null;
  updated_at: string | null;

  constructor(data: Partial<IProductOptionGroup> = {}) {
    this.product_option_group_id = data.product_option_group_id ?? null;
    this.product_variant_id = data.product_variant_id ?? null;
    this.product_id = data.product_id ?? null;
    this.variant_name = data.variant_name ?? null;
    this.option_group_name = data.option_group_name ?? null;
    this.sort_order = data.sort_order ?? "0";
    this.active_status = data.active_status ?? false;
    this.created_at = data.created_at ?? null;
    this.updated_at = data.updated_at ?? null;
  }
}