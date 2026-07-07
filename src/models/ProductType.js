export default class ProductType {
  constructor(data = {}) {
    this.product_type_id = data.product_type_id ?? null;
    this.name = data.name ?? '';
    this.type = data.type ?? '';
    this.plural = data.plural ?? '';
    this.icon = data.icon ?? '';
    this.image = data.image ?? [];
    this.source = data.source ?? 'default';
    this.site_id = data.site_id ?? 1;
  }

  static fromJSON(data) {
    return new ProductType(data);
  }
} 