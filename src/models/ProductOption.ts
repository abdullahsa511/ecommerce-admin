export interface IProductOptionData {
  product_option_id?: number | null;
  product_id?: number | null;
  product_variant_id?: number | null;
  product_option_group_id?: number | null;
  option_name?: string | null;
  sort_order?: number | null;
  product_code?: string | null;
  variant_name?: string | null;
  option_group_name?: string | null;
  hex_color?: string | null;
}

export default class ProductOption implements IProductOptionData {
  product_option_id: number | null;
  product_id: number | null;
  product_variant_id: number | null;
  product_option_group_id: number | null;
  option_name: string | null;
  sort_order: number | null;
  product_code: string | null;
  variant_name: string | null;
  option_group_name: string | null;
  hex_color: string | null;

  constructor(data: Partial<IProductOptionData> = {}) {
    this.product_option_id = data.product_option_id ?? null;
    this.product_id = data.product_id ?? null;
    this.product_variant_id = data.product_variant_id ?? null;
    this.product_option_group_id = data.product_option_group_id ?? null;
    this.option_name = data.option_name ?? null;
    this.sort_order = data.sort_order ?? null;
    this.product_code = data.product_code ?? null;
    this.variant_name = data.variant_name ?? null;
    this.option_group_name = data.option_group_name ?? null;
    this.hex_color = data.hex_color ?? null;
  }

  static fromDBRow(row: any): ProductOption {
    return new ProductOption({
      product_option_id: row.product_option_id ?? null,
      product_id: row.product_id ?? null,
      product_variant_id: row.product_variant_id ?? null,
      product_option_group_id: row.product_option_group_id ?? null,
      option_name: row.option_name ?? null,
      sort_order: row.sort_order ?? null,
      product_code: row.product_code ?? null,
      variant_name: row.variant_name ?? null,
      option_group_name: row.option_group_name ?? null,
      hex_color: row.hex_color ?? null,
    });
  }
}
