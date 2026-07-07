
export default class Taxonomy {
  constructor(data = {}) {
    this.taxonomy_id = data.taxonomy_id ?? null;
    this.name = data.name ?? '';
    this.post_type = data.post_type ?? '';
    this.type = data.type ?? 'categories';
    this.site_id = data.site_id ?? 1;
  }

  static fromJSON(data) {
    return new Taxonomy(data);
  }
}

export class TaxonomyType {
  constructor(data = {}) {
    this.name = data?.name ?? '';
    this.code = data?.code ?? '';
  }
  static fromJSON(data) {
    return new TaxonomyType(data);
  }
}
