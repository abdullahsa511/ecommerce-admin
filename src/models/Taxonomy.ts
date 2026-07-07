export interface ITaxonomy {
  taxonomy_id: number | null;
  name: string;
  post_type: string;
  type: string;
  site_id: number;
}

export interface ICategory {
  children: ICategory[];
  key: string;
  label: string;
  id: number;
}

export class Category implements ICategory {
  children: ICategory[];
  key: string;
  label: string;
  id: number;

  constructor(data: Partial<ICategory> = {}) {
    this.children = data.children ?? [];
    this.key = data.key ?? '';
    this.label = data.label ?? '';
    this.id = data.id ?? 0;
  }
}

export default class Taxonomy implements ITaxonomy {
  taxonomy_id: number | null;
  name: string;
  post_type: string;
  type: string;
  site_id: number;

  constructor(data: Partial<ITaxonomy> = {}) {
    this.taxonomy_id = data.taxonomy_id ?? null;
    this.name = data.name ?? '';
    this.post_type = data.post_type ?? '';
    this.type = data.type ?? 'categories';
    this.site_id = data.site_id ?? 1;
  }

  static fromJSON(data: Partial<ITaxonomy>): Taxonomy {
    return new Taxonomy(data);
  }
}
