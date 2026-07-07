import { FileModel, IFileModel } from "./Media";

export interface IVariantContent {
  variant_id?: number | null;
  name?: string;
  language_id?: number | null;
  language_name?: string | null;
  language_code?: string | null;
}

export interface IVariant {
  product_variant_id?: number | null;
  product_id?: number | null;
  product_code?: string | null;
  variant_name?: string | null;
  variant_id?: number | null;
  code?: string | null;
  sort_order?: number | null;
  active_status?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  image?: IFileModel[] | [];
  content?: IVariantContent;
}

export default class Variant implements IVariant {
  product_variant_id: number | null;
  product_id: number | null;
  product_code: string | null;
  variant_name: string | null;
  variant_id: number | null;
  code: string | null;
  sort_order: number | null;
  active_status: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  image?: IFileModel[] | [];
  content: IVariantContent;

  constructor(data: Partial<IVariant> = {}) {
    this.product_variant_id = data.product_variant_id ?? null;
    this.product_id = data.product_id ?? null;
    this.product_code = data.product_code ?? null;
    this.variant_name = data.variant_name ?? null;
    this.variant_id = data.variant_id ?? null;
    this.code = data.code ?? null;
    this.sort_order = data.sort_order ?? 0;
    this.active_status = data.active_status ?? false;
    this.created_at = data.created_at ?? null;
    this.updated_at = data.updated_at ?? null;
    this.image = data.image && Array.isArray(data.image) ? data.image.map(i => new FileModel(i)) : []; // Need to change to IFileModel[] using array.map callback
    // this.sort_order = data.sort_order ?? 0;
    this.content = new VariantContent(data.content ?? {});
  }
}

class VariantContent implements IVariantContent {
  name: string;
  variant_id: number | null;
  language_id: number | null;
  language_name?: string | null;
  language_code?: string | null;

  constructor(data: Partial<IVariantContent> = {}) {
    this.name = data.name ?? '';
    this.variant_id = data.variant_id ?? null;
    this.language_id = data.language_id ?? 1;
    this.language_name = data.language_name ?? null;
    this.language_code = data.language_code ?? null;
  }


}
