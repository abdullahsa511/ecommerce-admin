import { FileModel, IFileModel } from "./Media.ts";
import { ProductVariant, ProductOptionGroup, IProductOption, ProductOption, IProductVariant, IProductOptionGroup } from "./Product.ts";


export interface IVariantItem extends IProductVariant {
  item_code: string;
  itemOptionGroups: IItemOptionGroup[]
}

export class VariantItem extends ProductVariant implements IVariantItem {
  item_code: string;
  itemOptionGroups: IItemOptionGroup[];

  constructor(data: Partial<IVariantItem> = {}) {
    super(data);
    this.item_code = data.item_code ?? "";
    this.itemOptionGroups = (data.productOptionGroups || []).map(g => new ItemOptionGroup(g))
    // const optionGroups = data.itemOptionGroups ?? data.productOptionGroups ?? [];
    // this.itemOptionGroups = optionGroups.map(g => new ItemOptionGroup(g));
    // this.productOptionGroups = this.itemOptionGroups as ProductOptionGroup[];
  }
}

export interface IItemOptionGroup extends IProductOptionGroup {
   itemOptions: IItemOption[]
}

export class ItemOptionGroup extends ProductOptionGroup implements IItemOptionGroup{
  itemOptions: IItemOption[];
  constructor(data: Partial<IItemOptionGroup>){
    super(data)
    this.itemOptions = (data.productOptions || []).map(o => new ItemOption(o))
  }
  // constructor(data: Partial<IItemOptionGroup> = {}){
  //   const normalizedOptions = (data.itemOptions ?? data.productOptions ?? []).map(o => new ItemOption(o));
  //   super({
  //     ...data,
  //     productOptions: normalizedOptions,
  //   });
  // }

  // get itemOptions(): IItemOption[] {
  //   return this.productOptions as IItemOption[];
  // }

  // set itemOptions(options: IItemOption[]) {
  //   this.productOptions = options;
  // }
}

export interface IItemOption extends IProductOption {
  group_name: string;
}

export class ItemOption extends ProductOption implements IItemOption {
  group_name: string;
  constructor(data: Partial<IItemOption>){
    
    super(data)
    this.group_name = data.group_name ?? "";
    // this.group_name = data.group_name ?? data.option_group_name ?? "";
  }
}





export interface IItem {
  item_id: number | null;
  product_id: number;
  product_variant_id: number;

  km_item_id: number | null;
  item_type_id: number;
  item_category_id: number;

  vendor_id: number;
  import_vendor_id: number;
  factory_vendor_id: number;

  item_code: string;
  description: string | null;
  specifications: string | null;
  warranty_period: string | null;

  track_stock: string|boolean|undefined;
  safety_stock: number;

  lead_days: number;
  melbourne_lead_days: number;
  brisbane_lead_days: number;

  // size
  width: number;
  height: number;
  depth: number;

  display_width: string;
  display_height: string;
  display_depth: string;

  // carton
  carton_width: number;
  carton_height: number;
  carton_depth: number;
  carton_qm: number;

  gross_weight: number;
  products_per_cartoon: number;

  project_price_qty: number | null;
  project_price_discount: number | null;

  sort_order: number;
  active: number;
  archive: number;

  delay_until: string | null;
  delay_until_reason: string;

  // created_at: string | null;
  // updated_at: string | null;

  web_link: string;
  web_sku: string;
  quote_image: IFileModel[] | [];
  dimensions_image: IFileModel[] | [];

  class: string;
  user_note: string;
  // boardusages
  boardusages_eighteen: number;
  boardusages_twentyfive: number;
  boardusages_thirtythree: number;
  boradusages_sixteen: number;

  krost_zoho_id: string;
  krost_qld_zoho_id: string;
  gregbar_zoho_id: string;
  meloz_zoho_id: string;
  klein_zoho_id: string;
  is_default: boolean;
  // product
  product_code: string;
  // product_variant
  product_variant: string;
  variantItems: IVariantItem[];
}

export default class Item implements IItem {
  item_id!: number | null;
  product_id!: number ;
  product_variant_id!: number;
  km_item_id!: number | null;
  item_type_id!: number;
  item_category_id!: number;
  vendor_id!: number;
  import_vendor_id!: number;
  factory_vendor_id!: number;
  item_code!: string;
  description!: string | null;
  specifications!: string | null;
  warranty_period!: string | null;
  track_stock!: string|boolean|undefined;
  safety_stock!: number;
  lead_days!: number;
  melbourne_lead_days!: number;
  brisbane_lead_days!: number;
  width!: number;
  height!: number;
  depth!: number;
  display_width!: string;
  display_height!: string;
  display_depth!: string;
  carton_width!: number;
  carton_height!: number;
  carton_depth!: number;
  carton_qm!: number;
  gross_weight!: number;
  products_per_cartoon!: number;
  project_price_qty!: number | null;
  project_price_discount!: number | null;
  sort_order!: number;
  active!: number;
  archive!: number;
  delay_until!: string | null;
  delay_until_reason!: string;
  // created_at: string | null;
  // updated_at: string | null;
  web_link!: string;
  web_sku!: string;
  quote_image!: IFileModel[] | [];
  dimensions_image!: IFileModel[] | [];
  class!: string;
  user_note!: string;
  boardusages_eighteen!: number;
  boardusages_twentyfive!: number;
  boardusages_thirtythree!: number;
  boradusages_sixteen!: number;
  krost_zoho_id!: string;
  krost_qld_zoho_id!: string;
  gregbar_zoho_id!: string;
  meloz_zoho_id!: string;
  klein_zoho_id!: string;
  is_default: boolean;

  product_code!: string;
  product_variant!: string;
  variantItems!: IVariantItem[];

  constructor(data: Partial<IItem> = {}) {
    this.hydrate(data);
    this.is_default = !!data.is_default;
  }

  hydrate(data: Partial<IItem> = {}): this {
    this.item_id = data.item_id ?? null;
    this.product_id = data.product_id ?? 0;
    this.product_variant_id = data.product_variant_id ?? 0;

    this.km_item_id = data.km_item_id ?? null;
    this.item_type_id = data.item_type_id ?? 0;
    this.item_category_id = data.item_category_id ?? 0;

    this.vendor_id = data.vendor_id ?? 0;
    this.import_vendor_id = data.import_vendor_id ?? 0;
    this.factory_vendor_id = data.factory_vendor_id ?? 0;

    this.item_code = data.item_code ?? "";
    this.description = data.description ?? "";
    this.specifications = data.specifications ?? "";
    this.warranty_period = data.warranty_period ?? null;

    this.track_stock = data.track_stock ?? false;
    this.safety_stock = data.safety_stock ?? 0;

    this.lead_days = data.lead_days ?? 0;
    this.melbourne_lead_days = data.melbourne_lead_days ?? 0;
    this.brisbane_lead_days = data.brisbane_lead_days ?? 0;

    this.width = Number(data.width ?? 0);
    this.height = Number(data.height ?? 0);
    this.depth = Number(data.depth ?? 0);

    this.display_width = data.display_width ?? "";
    this.display_height = data.display_height ?? "";
    this.display_depth = data.display_depth ?? "";

    this.carton_width = Number(data.carton_width ?? 0);
    this.carton_height = Number(data.carton_height ?? 0);
    this.carton_depth = Number(data.carton_depth ?? 0);
    this.carton_qm = Number(data.carton_qm ?? 0);

    this.gross_weight = Number(data.gross_weight ?? 0);
    this.products_per_cartoon = Number(data.products_per_cartoon ?? 1);

    this.project_price_qty = data.project_price_qty ?? null;
    this.project_price_discount = data.project_price_discount ?? null;

    this.sort_order = data.sort_order ?? 0;
    this.active = data.active ?? 1;
    this.archive = data.archive ?? 0;

    this.delay_until = data.delay_until ?? null;
    this.delay_until_reason = data.delay_until_reason ?? "";

    // this.created_at = data.created_at ?? null;
    // this.updated_at = data.updated_at ?? null;

    this.web_link = data.web_link ?? "";
    this.web_sku = data.web_sku ?? "";
    this.quote_image = this.mapQuoteImages(data.quote_image);
    this.dimensions_image = data.dimensions_image ?? [];
    this.class = data.class ?? "";
    this.user_note = data.user_note ?? "";

    this.boardusages_eighteen = Number(data.boardusages_eighteen ?? 0);
    this.boardusages_twentyfive = Number(data.boardusages_twentyfive ?? 0);
    this.boardusages_thirtythree = Number(data.boardusages_thirtythree ?? 0);
    this.boradusages_sixteen = Number(data.boradusages_sixteen ?? 0);

    this.krost_zoho_id = data.krost_zoho_id ?? "";
    this.krost_qld_zoho_id = data.krost_qld_zoho_id ?? "";
    this.gregbar_zoho_id = data.gregbar_zoho_id ?? "";
    this.meloz_zoho_id = data.meloz_zoho_id ?? "";
    this.klein_zoho_id = data.klein_zoho_id ?? "";

    this.product_code = data.product_code ?? "";
    this.product_variant = data.product_variant ?? "";
    this.variantItems = (data.variantItems ?? []).map(v => new VariantItem(v));

    return this;
  }

  private mapQuoteImages(data: IItem["quote_image"] | Partial<IFileModel> | string | null | undefined): IFileModel[] {
    if (Array.isArray(data)) {
      return data.map(file => file instanceof FileModel ? file : new FileModel(file));
    }

    if (typeof data === "string") {
      return data
        ? [new FileModel({ image: data, objectURL: data })]
        : [];
    }

    if (data) {
      return [data instanceof FileModel ? data : new FileModel(data)];
    }

    return [];
  }

}
