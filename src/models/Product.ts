/**
 * @fileoverview Product model class for managing product configurations
 */

import { IItem } from "./Item.ts";
import { FileModel, IFileModel } from "./Media.ts";

export interface ITaxonomy {
  taxonomy_id: number;
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

interface IProductContent {
  product_id: number | null;
  language_id: number;
  name: string;
  title: string;
  slug: string;
  content: string;
  tag_line: string;
  rules: string;
  tag: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
}

class ProductContent implements IProductContent {
  product_id: number | null;
  language_id: number;
  name: string;
  title: string;
  slug: string;
  content: string;
  tag_line: string;
  rules: string;
  tag: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;

  constructor(data: Partial<IProductContent> = {}) {
    this.product_id = data.product_id ?? null;
    this.language_id = data.language_id ?? 1;
    this.name = data.name ?? ''; // Alex Chair
    this.title = data.title ?? ''; // Alex Chair
    this.slug = data.slug ?? ''; // alex-chair
    this.content = data.content ?? ''; // This is a product content
    this.tag_line = data.tag_line ?? ''; // tag 
    this.rules = data.rules ?? ''; // rules 
    this.tag = data.tag ?? ''; // Alex Chair
    this.meta_title = data.meta_title ?? ''; // Alex Chair
    this.meta_description = data.meta_description ?? ''; // This is a product meta description
    this.meta_keywords = data.meta_keywords ?? ''; // Alex Chair, Chair, Furniture
  }
}


export interface IProductPromotion {
  product_promotion_id: number;
  product_id: number;
  user_group_id: number;
  user_group_name: string;
  priority: number;
  price: number;
  from_date: string;
  to_date: string;
}

export class ProductPromotion implements IProductPromotion {
  product_promotion_id: number;
  product_id: number;
  user_group_id: number;
  user_group_name: string;
  priority: number;
  price: number;
  from_date: string;
  to_date: string;

  constructor(data: any = {}) {
    this.product_promotion_id = data.product_promotion_id ?? 0;
    this.product_id = data.product_id ?? 0;
    this.user_group_id = data.user_group_id ?? 0;
    this.user_group_name = data.user_group_name ?? ''; // Default
    this.priority = data.priority ?? 0;
    this.price = data.price ?? 0;
    this.from_date = data.from_date ?? '';
    this.to_date = data.to_date ?? '';
  }
}


// interface IProductOption {
//   index: number;
//   product_option_id: number;
//   product_id: number;
//   option_id: number|string;
//   required: boolean;
//   value: string;
//   name: string;
//   type: 'Texture' | 'Colour';
//   image: IFileModel[] | [];
//   imagePreview?: string;
//   price: number;
//   textureFile?: IFileModel[] | [];
//   texturePreview?: string;
//   colourHex?: string;
//   metadata?: string;
//   sort_order: number;
// }

// export class ProductOption implements IProductOption_old {
//   index: number;
//   product_option_id: number;
//   product_id: number;
//   option_id: number|string;
//   required: boolean;
//   value: string | any;
//   name: string;
//   type: 'Texture' | 'Colour'|any;
//   textureFile?: IFileModel[] | [];
//   texturePreview?: string;
//   colourHex?: string;
//   metadata?: string;
//   image: IFileModel[] | [];
//   imagePreview?: string;
//   price: number;
//   sort_order: number;

//   constructor(data: Partial<IProductOption_old> = {}) {
//     this.index = data.index ?? 0;
//     this.product_option_id = data.product_option_id ?? 0;
//     this.product_id = data.product_id ?? 0;
//     this.option_id = data.option_id ?? 0;
//     this.required = data.required ?? false;
//     this.value = data.value ?? '';
//     this.name = data.name ?? '';
//     this.type = data.type ?? ''; // Texture
//     this.textureFile = data.textureFile ?? [];
//     this.texturePreview = data.texturePreview ?? '';
//     this.colourHex = data.colourHex ?? ''; // #666666
//     this.metadata = data.metadata ?? '';
//     this.image = data.image ?? []; // Need to change to IFileModel[] using array.map callback
//     this.imagePreview = data.image?.[0]?.objectURL ?? ''; // objectUrl of this.image[0]
//     this.price = data.price ?? 0;
//     this.sort_order = data.sort_order ?? 0;
//   }
// }

// export interface IProductVariant_old {
//   variant: string;
//   price: number;
//   old_price: number;
//   quantity: number;
//   stock: boolean;
//   weight: number;
//   sku: string;
//   barcode: string;
// }

// class ProductVariant implements IProductVariant_old {
//   variant: string;
//   price: number;
//   old_price: number;
//   quantity: number;
//   stock: boolean;
//   weight: number;
//   sku: string;
//   barcode: string;

//   constructor(data: Partial<IProductVariant_old> = {}) {
//     this.variant = data.variant ?? '';
//     this.price = data.price ?? 0;
//     this.old_price = data.old_price ?? 0;
//     this.quantity = data.quantity ?? 0;
//     this.stock = data.stock ?? false;
//     this.weight = data.weight ?? 0;
//     this.sku = data.sku ?? '';
//     this.barcode = data.barcode ?? '';
//   }
// }



interface IProductAttribute {
  index: number;
  product_attribute_id: number | string;
  product_id: number;
  attribute_id: number | string;
  required: boolean;
  value: string | any;
  name: string;
  description: string;
  metadata: string;
  type: string;
  // image: FileModel[] | [];
  image: IFileModel[] | [];
  imagePreview: string;
}

export class ProductAttribute implements IProductAttribute {
  index: number;
  product_attribute_id: number | string;
  product_id: number;
  attribute_id: number | string;
  required: boolean;
  value: string | any;
  name: string;
  description: string;
  metadata: string;
  type: string;
  image: IFileModel[] | [];
  imagePreview: string;

  constructor(data: Partial<IProductAttribute> = {}) {
    this.index = data.index ?? 0;
    this.product_attribute_id = data.product_attribute_id ?? 0;
    this.product_id = data.product_id ?? 0;
    this.attribute_id = data.attribute_id ?? 0;
    this.required = data.required ?? false;
    this.value = data.value ?? '';
    this.name = data.name ?? '';
    this.description = data.description ?? '';
    this.metadata = data.metadata ?? '';
    this.type = data.type ?? '';
    this.image = data.image ?? [];
    this.imagePreview = data.imagePreview ?? '';
  }
}


export interface IManufacturer {
  manufacturer_id: number;
  name: string;
  slug: string;
  image: string;
  sort_order: number;
}

class Manufacturer implements IManufacturer {
  manufacturer_id: number;
  name: string;
  slug: string;
  image: string;
  sort_order: number;

  constructor(data: Partial<IManufacturer> = {}) {
    this.manufacturer_id = data.manufacturer_id ?? 0;
    this.name = data.name ?? '';
    this.slug = data.slug ?? '';
    this.image = data.image ?? '';
    this.sort_order = data.sort_order ?? 0;
  }
}

export interface IVendor {
  vendor_id: number;
  admin_id: number;
  name: string;
  slug: string;
  image: string;
  sort_order: number;
}

class Vendor implements IVendor {
  vendor_id: number;
  admin_id: number;
  name: string;
  slug: string;
  image: string;
  sort_order: number;

  constructor(data: Partial<IVendor> = {}) {
    this.vendor_id = data.vendor_id ?? 0;
    this.admin_id = data.admin_id ?? 0;
    this.name = data.name ?? '';
    this.slug = data.slug ?? '';
    this.image = data.image ?? '';
    this.sort_order = data.sort_order ?? 0;
  }
}

interface IStockStatus {
  stock_status_id: number;
  language_id: number;
  name: string;
}

class StockStatus implements IStockStatus {
  stock_status_id: number;
  language_id: number;
  name: string;

  constructor(data: Partial<IStockStatus> = {}) {
    this.stock_status_id = data.stock_status_id ?? 0;
    this.language_id = data.language_id ?? 0;
    this.name = data.name ?? '';
  }
}

interface IProductRelated {
  product_id: number;
  name: string;
}

class ProductRelated implements IProductRelated {
  product_id: number;
  name: string;

  constructor(data: Partial<IProductRelated> = {}) {
    this.product_id = data.product_id ?? 0;
    this.name = data.name ?? '';
  }
}

export interface IRelatedProjects {
  project_id: number;
  name: string;
  image: string;
}

export class RelatedProjects implements IRelatedProjects {
  project_id: number;
  name: string;
  image: string;

  constructor(data: Partial<IRelatedProjects> = {}) {
    this.project_id = data.project_id ?? 0;
    this.name = data.name ?? '';
    this.image = data.image ?? '';
  }
}

export interface IRelatedResources {
  design_resource_id: number;
  name: string;
  type: string;
}

export class RelatedResources implements IRelatedResources {
  design_resource_id: number;
  name: string;
  type: string;

  constructor(data: Partial<IRelatedResources> = {}) {
    this.design_resource_id = data.design_resource_id ?? 0;
    this.name = data.name ?? '';
    this.type = data.type ?? '';
  }
}

export interface IDigitalAsset {
  digital_asset_id: number;
  name: string;
}

export class DigitalAsset implements IDigitalAsset {
  digital_asset_id: number;
  name: string;

  constructor(data: Partial<IDigitalAsset> = {}) {
    this.digital_asset_id = data.digital_asset_id ?? 0;
    this.name = data.name ?? '';
  }
}

interface IProductConfiguration {
  name: string;
  color: string;
  attributes: string;
  description: string;
  rules: string;
  tags: string[];
  keywords: string;
  metadata: string;
  defaultOptions: Array<{
    fabric: string;
    fabricPreview: string;
    hex: string;
    hexColor: string;
  }>;
  optionList: Array<{
    type: string;
    value: string;
    preview: string;
  }>;
  variances: Array<{
    arms: string;
  }>;
}

class ProductConfiguration implements IProductConfiguration {
  name: string;
  color: string;
  attributes: string;
  description: string;
  rules: string;
  tags: string[];
  keywords: string;
  metadata: string;
  defaultOptions: Array<{
    fabric: string;
    fabricPreview: string;
    hex: string;
    hexColor: string;
  }>;
  optionList: Array<{
    type: string;
    value: string;
    preview: string;
  }>;
  variances: Array<{
    arms: string;
  }>;

  constructor(data: Partial<IProductConfiguration> = {}) {
    this.name = data.name ?? '';
    this.color = data.color ?? ''; // #444444
    this.attributes = data.attributes ?? '';
    this.description = data.description ?? '';
    this.rules = data.rules ?? ''; // Arm Matching\nDefault No Arms on Initial Load
    this.tags = data.tags ?? [];
    this.keywords = data.keywords ?? '';
    this.metadata = data.metadata ?? '';
    this.defaultOptions = data.defaultOptions ?? [
      {
        fabric: 'Charcoal_Cashmere.jpg', // Charcoal_Cashmere.jpg
        fabricPreview: 'https://dummyimage.com/40x40/444/fff&text=F', // https://dummyimage.com/40x40/444/fff&text=F
        hex: '#000000 - Black',
        hexColor: '#000000', // #000000
      }
    ];
    this.optionList = data.optionList ?? [
      { type: 'Fabric', value: 'Grey_Cashmere.jpg', preview: 'https://dummyimage.com/40x40/888/fff&text=G' }, // Grey_Cashmere.jpg
      { type: 'Fabric', value: 'Tan_Synthetic Leather.jpg', preview: 'https://dummyimage.com/40x40/b98/fff&text=T' }, // Tan_Synthetic Leather.jpg
      { type: 'Fabric', value: 'Tan_Synthetic Leather.jpg', preview: 'https://dummyimage.com/40x40/b98/fff&text=T' }, // Tan_Synthetic Leather.jpg
      { type: 'HEX', value: '#FFFFFF - White', preview: '#FFFFFF' }, // #FFFFFF
      { type: 'HEX', value: '#SSSSSS - Silver', preview: '#CCCCCC' }, // #CCCCCC  
    ];
    this.variances = data.variances ?? [
      {
        arms: 'If arm_option = With Arms, then arm_color = base_color', // If arm_option = With Arms, then arm_color = base_color
      }
    ];
  }
}



interface IProductInventory {
  model: string;
  sku: string;
  upc: string;
  ean: string;
  jan: string;
  isbn: string;
  mpn: string;
  storage_location: string;
  price: number;
  old_price: number;
  points: number;
  tax_class: string;
  quantity: number;
  min_order_quantity: number;
  subtract_stock: boolean;
  out_of_stock_status: string;
  date_available: string;
  status: string;
}

class ProductInventory implements IProductInventory {
  model: string;
  sku: string;
  upc: string;
  ean: string;
  jan: string;
  isbn: string;
  mpn: string;
  storage_location: string;
  price: number;
  old_price: number;
  points: number;
  tax_class: string;
  quantity: number;
  min_order_quantity: number;
  subtract_stock: boolean;
  out_of_stock_status: string;
  date_available: string;
  status: string;

  constructor(data: Partial<IProductInventory> = {}) {
    this.model = data.model ?? '';
    this.sku = data.sku ?? '';
    this.upc = data.upc ?? '';
    this.ean = data.ean ?? '';
    this.jan = data.jan ?? '';
    this.isbn = data.isbn ?? '';
    this.mpn = data.mpn ?? '';
    this.storage_location = data.storage_location ?? '';
    this.price = data.price ?? 0;
    this.old_price = data.old_price ?? 0;
    this.points = data.points ?? 0;
    this.tax_class = data.tax_class ?? 'Taxable Goods';
    this.quantity = data.quantity ?? 0;
    this.min_order_quantity = data.min_order_quantity ?? 0;
    this.subtract_stock = data.subtract_stock ?? true;
    this.out_of_stock_status = data.out_of_stock_status ?? 'In Stock';
    this.date_available = data.date_available ?? '';
    this.status = data.status ?? 'Enabled';
  }
}

interface IProductShipping {
  requires_shipping: boolean;
  width: number;
  height: number;
  length: number;
  length_class: string;
  weight: number;
  weight_class: string;
}

class ProductShipping implements IProductShipping {
  requires_shipping: boolean;
  width: number;
  height: number;
  length: number;
  length_class: string;
  weight: number;
  weight_class: string;

  constructor(data: Partial<IProductShipping> = {}) {
    this.requires_shipping = data.requires_shipping ?? true;
    this.width = data.width ?? 0;
    this.height = data.height ?? 0;
    this.length = data.length ?? 0;
    this.length_class = data.length_class ?? 'Centimeter';
    this.weight = data.weight ?? 0;
    this.weight_class = data.weight_class ?? 'Kilogram';
  }
}

interface IProductSeo {
  open_graph_title: string;
  open_graph_description: string;
  twitter_title: string;
  twitter_description: string;
  twitter_label_1: string;
  twitter_label_2: string;
  twitter_data_1: string;
  twitter_data_2: string;
}

class ProductSeo implements IProductSeo {
  open_graph_title: string;
  open_graph_description: string;
  twitter_title: string;
  twitter_description: string;
  twitter_label_1: string;
  twitter_label_2: string;
  twitter_data_1: string;
  twitter_data_2: string;

  constructor(data: Partial<IProductSeo> = {}) {
    this.open_graph_title = data.open_graph_title ?? '';
    this.open_graph_description = data.open_graph_description ?? '';
    this.twitter_title = data.twitter_title ?? '';
    this.twitter_description = data.twitter_description ?? '';
    this.twitter_label_1 = data.twitter_label_1 ?? '';
    this.twitter_label_2 = data.twitter_label_2 ?? '';
    this.twitter_data_1 = data.twitter_data_1 ?? '';
    this.twitter_data_2 = data.twitter_data_2 ?? '';
  }
}

export interface IProductImage {
  id: number | null;
  product_image_id: number | null;
  product_certificate_id: number | null;
  design_resource_id: number | null;
  design_resource_document_id: number | null;
  image: string;
  name: string;
  description: string;
  size: string;
  type: string;
  objectURL: string;
  file: File | undefined;
  status: any;
}

export class ProductImage implements IProductImage {
  id: number | null;
  product_image_id: number | null;
  product_certificate_id: number | null;
  design_resource_id: number | null;
  design_resource_document_id: number | null;
  image: string;
  name: string;
  description: string;
  size: string;
  type: string;
  objectURL: string;
  file: File | undefined;
  status: any;

  constructor(data: Partial<IProductImage> = {}) {
    this.id = data.id ?? null;
    this.image = data.image ?? '';
    this.name = data.name ?? '';
    this.description = data.description ?? '';
    this.product_image_id = data.product_image_id ?? 0;
    this.product_certificate_id = data.product_certificate_id ?? 0;
    this.design_resource_id = data.design_resource_id ?? 0;
    this.design_resource_document_id = data.design_resource_document_id ?? 0;
    this.size = data.size ?? '';
    this.type = data.type ?? '';
    this.objectURL = data.objectURL ?? '';
    this.file = data.file;
    this.status = data.status ?? { name: 'Pending', severity: 'warning' };
  }
}



export interface IProductVariant {
  product_variant_id: number;
  isNew: boolean;
  selected: boolean;
  product_id: number;
  item_id: number;
  variant_item_id: number;
  product_code: string;
  variant_name: string;
  sort_order: number;
  active_status: boolean;
  variant_description: string | null;
  variant_code: string | null;
  image: IFileModel[] | [];
  imagePreview: string;
  productOptionGroups: IProductOptionGroup[];
  hasDuplicateVariantName: boolean;
  duplicateWarningMessage: string;

}

export class ProductVariant implements IProductVariant {
  product_variant_id: number;
  isNew: boolean;
  selected: boolean;
  variant_item_id: number;
  product_id: number;
  item_id: number;
  km_item_id: number | null;
  product_code: string;
  variant_name: string;
  sort_order: number;
  active_status: boolean;
  variant_description: string | null;
  variant_code: string | null;
  image: IFileModel[] | [];
  imagePreview: string;
  productOptionGroups: IProductOptionGroup[];
  hasDuplicateVariantName: boolean;
  duplicateWarningMessage: string;


  constructor(data: Partial<IProductVariant> = {}) {
    this.product_variant_id = data.product_variant_id ?? 0;
    this.isNew = data.isNew ?? false;
    this.selected = data.selected ?? false;
    this.variant_item_id = data.variant_item_id ?? 0;
    this.product_id = data.product_id ?? 0;
    this.item_id = data.item_id ?? 0;
    this.km_item_id = 5678;
    this.product_code = data.product_code ?? "";
    this.variant_name = data.variant_name ?? "";
    this.sort_order = data.sort_order ?? 0;
    this.active_status = data.active_status ?? false;
    this.variant_description = data.variant_description ?? "";
    this.variant_code = data.variant_code ?? null;
    this.image = data.image && Array.isArray(data.image) ? data.image.map(i => new FileModel(i)) : []; // Need to change to IFileModel[] using array.map callback
    this.imagePreview = data.image?.[0]?.objectURL ?? ''; // objectUrl of this.image[0]
    this.hasDuplicateVariantName = data.hasDuplicateVariantName ?? false;
    this.duplicateWarningMessage = data.duplicateWarningMessage ?? '';

    this.productOptionGroups = (data.productOptionGroups ?? []).map(o => new ProductOptionGroup(o));

  }
}

export interface IProductOptionGroup {
  product_option_group_id: number | string;
  item_option_group_id: number | string;
  product_id: number;
  item_id: number;
  product_variant_id: number;
  variant_name: string;
  option_group_name: string;
  option_group_description: string;
  sort_order: number;
  option_group_code: string;
  description: string;
  active_status: boolean;
  optionGroupImage: IFileModel[] | [];
  optionGroupImagePreview: string;
  productOptions: IProductOption[];
  active: boolean;
  isNew: boolean;
}

export class ProductOptionGroup implements IProductOptionGroup {
  product_option_group_id: number | string;
  item_option_group_id: number | string;
  product_id: number;
  item_id: number;
  product_variant_id: number;
  option_group_name: string;
  option_group_description: string;
  variant_name: string;
  option_group_code: string;
  description: string;
  sort_order: number;
  active_status: boolean;
  optionGroupImage: IFileModel[] | [];
  optionGroupImagePreview: string;
  productOptions: IProductOption[];
  active: boolean;
  isNew: boolean;

  constructor(data: Partial<IProductOptionGroup> = {}) {
    this.product_option_group_id = data.product_option_group_id ?? 0;
    this.item_option_group_id = data.item_option_group_id ?? 0;
    this.product_id = data.product_id ?? 0;
    this.item_id = data.item_id ?? 0;
    this.product_variant_id = data.product_variant_id ?? 0;
    this.option_group_name = data.option_group_name ?? "";
    this.variant_name = data.variant_name ?? "";
    this.option_group_description = data.option_group_description ?? "";
    this.option_group_code = data.option_group_code ?? "";
    this.description = data.description ?? "";
    this.sort_order = data.sort_order ?? 0;
    this.active_status = data.active_status ?? false;
    this.optionGroupImage = data.optionGroupImage ?? []; // Need to change to IFileModel[] using array.map callback
    this.optionGroupImagePreview = data.optionGroupImage?.[0]?.objectURL ?? ''; // objectUrl of this.image[0]

    // this.optionGroupImage = (data.optionGroupImage ?? []).map(f => new FileModel(f));
    this.productOptions = (data.productOptions ?? []).map(o => new ProductOption(o));
    this.active = data.active ?? false;
    this.isNew = data.isNew ?? false;

  }
}


export interface IProductOption {
  index: number;
  product_code?: string | null;
  variant_name?: string | null;
  option_group_name?: string | null;
  item_option_id: number;
  product_option_id: number;
  product_id: number;
  product_variant_id: number;
  product_option_group_id: number;
  option_id: number | string;
  required: boolean;
  value: string;
  option_name: string;
  option_description: string;
  type: string;
  type_id: number;
  image: IFileModel[] | [];
  imagePreview?: string;
  price: number;
  textureFile?: IFileModel[] | [];
  texturePreview?: string;
  colourHex?: string;
  /** API / DB snake_case; kept in sync with colourHex in constructor */
  hex_color?: string;
  metadata?: string;
  sort_order: number;
  is_default: boolean;
  active_status: number;
  active: boolean;
  selected: boolean;
}

export class ProductOption implements IProductOption {
  index: number;
  item_option_id: number;
  product_option_id: number;
  product_code?: string | null;
  variant_name?: string | null;
  option_group_name?: string | null;
  product_id: number;
  product_variant_id: number;
  product_option_group_id: number;
  option_id: number | string;
  required: boolean;
  value: string | any;
  option_name: string;
  option_description: string;
  type: string;
  type_id: number;
  textureFile?: IFileModel[] | [];
  texturePreview?: string;
  colourHex?: string;
  hex_color?: string;
  metadata?: string;
  image: IFileModel[] | [];
  imagePreview?: string;
  price: number;
  sort_order: number;
  is_default: boolean;
  active_status: number;
  active: boolean;
  selected: boolean;

  constructor(data: Partial<IProductOption> = {}) {
    this.index = data.index ?? 0;
    this.item_option_id = data.item_option_id ?? 0;
    this.product_option_id = data.product_option_id ?? 0;
    this.option_description = data.option_description ?? '';
    this.product_code = data.product_code ?? null;
    this.variant_name = data.variant_name ?? null;
    this.option_group_name = data.option_group_name ?? null;
    this.product_id = data.product_id ?? 0;
    this.product_variant_id = data.product_variant_id ?? 0;
    this.product_option_group_id = data.product_option_group_id ?? 0;
    this.option_id = data.option_id ?? 0;
    this.required = data.required ?? false;
    this.value = data.value ?? '';
    this.option_name = data.option_name ?? '';
    this.type = data.type ?? ''; // Texture
    this.type_id = data.type_id ?? 0;
    this.textureFile = data.textureFile ?? [];
    this.texturePreview = data.texturePreview ?? '';
    const hex = data.colourHex ?? data.hex_color ?? '';
    this.colourHex = hex; // #666666
    this.hex_color = hex;
    this.metadata = data.metadata ?? '';
    this.image = data.image ?? []; // Need to change to IFileModel[] using array.map callback
    this.imagePreview = data.image?.[0]?.objectURL ?? ''; // objectUrl of this.image[0]
    this.price = data.price ?? 0;
    this.sort_order = data.sort_order ?? 0;
    this.is_default = data.is_default ?? false;
    this.active_status = data.active_status ?? 0;
    this.active = data.active ?? false;
    this.selected = data.selected ?? false;

    // this.image = (data.image ?? []).map(f => new FileModel(f));
    // this.textureFile = (data.textureFile ?? []).map(f => new FileModel(f));
  }
}

export interface IProductAccessories {
  product_accessories_id: number;
  parent_product_id: number;
  product_id: number;
  item_id: string;
  price: number;
  image: IFileModel[] | [];
  active_status: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  parent_product_name: string;
  product_name: string;
  item_code: string;
}

export class ProductAccessories implements IProductAccessories {

  product_accessories_id: number;
  product_id: number;
  parent_product_id: number;
  item_id: string;
  price: number;
  image: IFileModel[] | [];
  active_status: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  parent_product_name: string;
  product_name: string;
  item_code: string;

  constructor(data: Partial<IProductAccessories> = {}) {
    this.product_accessories_id = data.product_accessories_id ?? 0;
    this.product_id = data.product_id ?? 0;
    this.parent_product_id = data.parent_product_id ?? 0;
    this.item_id = data.item_id ?? '';
    this.price = data.price ?? 0;
    this.image = data.image ?? [];
    this.active_status = data.active_status ?? 0;
    this.created_at = data.created_at ?? '';
    this.updated_at = data.updated_at ?? '';
    this.deleted_at = data.deleted_at ?? '';
    this.parent_product_name = data.parent_product_name ?? '';
    this.product_name = data.product_name ?? '';
    this.item_code = data.item_code ?? '';
  }
}

export type ProductSidebarMedia =
  | 'image'
  | 'feature_image'
  | 'image_banner'
  | 'banner_image'
  | 'image_thumb'
  | 'main_image_one'
  | 'main_image_two'
  | 'feature_image_one'
  | 'feature_image_two'
  | 'feature_image_three'
  | 'specifications_image'
  |'dimension_image';

export type SidebarMedia = ProductSidebarMedia | 'feature_image_thumb';

interface IProductItem {
  item_id: number;
  item_code: string;
  sku: string;
  description: string;
  price: number;
}

export class ProductItem implements IProductItem {
  item_id: number;
  item_code: string;
  sku: string;
  description: string;
  price: number;
  constructor(data: Partial<IProductItem> = {}) {
    this.item_id = data.item_id ?? 0;
    this.item_code = data.item_code ?? '';
    this.sku = data.sku ?? '';
    this.description = data.description ?? '';
    this.price = data.price ?? 0;
  }
}

export interface IProduct {
  product_id: number | null;
  km_item_id: number;
  product_type_id: number;
  class_id: number | null;
  company_id: number | null;
  admin_id: number;
  parent_id: number | null;
  model: string;
  description: string | null;
  feature_description: string | null;
  specifications: string | null;
  warranty_period: string | null;
  product_code: string;
  factory_code: string | null;
  sku: string;
  isbn: string;
  barcode: string;
  track_stock: boolean;
  stock_quantity: number;
  stock_status_id: number;
  lead_days: number;
  melbourne_lead_days: number;
  safety_stock: number;
  qty_alert: number;
  manufacturer_id: number | null;
  vendor_id: number | null;
  import_vendor_id: number | null;
  factory_vendor_id: number | null;
  product_range_id: number | null;
  product_category_id: number;
  edgetape_colour_id: number | null;
  requires_shipping: boolean;
  tax_type_id: number | null;
  material: string;
  weight: number | string | null;
  weight_type_id: number | null;
  length: string | null;
  length_type_id: number | null;
  width: string | null;
  height:  string | null;
  depth:  string | null;
  carton_qm: number | null;
  size: number | null;
  carton_width: number;
  carton_depth: number;
  carton_height: number;
  gross_weight: number | null;
  date_available: string | null;
  template: string;
  views: number;
  subtract_stock: boolean;
  status: boolean;
  is_featured: boolean;
  sort_order: number;
  project_price_qty: number | null;
  project_price_discount: number | null;
  active: boolean;
  archive: boolean;
  created_at: string;
  updated_at: string;
  min_order_quantity: number;
  out_of_stock_status: string;
  length_class: string;
  weight_class: string;
  categories: ICategory[];
  content: ProductContent;
  promotions: ProductPromotion[] | [];
  // options: ProductOption[];
  attributes: ProductAttribute[];
  configuration: ProductConfiguration;
  manufacturer: Manufacturer | null;
  vendor: Vendor | null;
  stockStatus: StockStatus | null;
  variantProducts: IProduct[];
  relatedProducts: IProduct[];
  relatedProjects: RelatedProjects[];
  relatedResources: RelatedResources[];
  familyProducts: IProduct[];
  digitalAssets: DigitalAsset[] | [];
  // inventory: ProductInventory;
  shipping: ProductShipping;
  productSeo: ProductSeo;
  image: ProductImage[] | [];
  image_banner: ProductImage[] | [];
  feature_image: ProductImage[] | [];
  banner_image: ProductImage[] | [];
  image_thumb: ProductImage[] | [];
  main_image_one: ProductImage[] | [];
  main_image_one_description: string;
  main_image_two: ProductImage[] | [];
  main_image_two_description: string;
  feature_image_one: ProductImage[] | [];
  feature_image_one_description: string;
  feature_image_two: ProductImage[] | [];
  feature_image_two_description: string;
  feature_image_three: ProductImage[] | [];
  specifications_image: ProductImage[] | [];
  dimension_image: ProductImage[] | [];
  feature_image_three_description: string;
  images: IFileModel[] | [];
  tags: any[];
  certificates: IFileModel[] | [];
  resources: IFileModel[] | [];
  metadata: any;
  price: number;
  old_price: number;

  productVariants: IProductVariant[]; // This is cor
  productOptionGroups: IProductOptionGroup[];
  productOptions: IProductOption[];

  items: IProductItem[];
  banner_way_points: any[];
  ocean_plastic_used: boolean;
  show_configurator: boolean;
  store_link: string;
  catalogue_link: string;
  video_url: string[] | string;
  main_image_one_title: string | null;
  main_image_two_title: string | null;
  feature_image_one_title: string | null;
  feature_image_two_title: string | null;
  feature_image_three_title: string | null;
}

/**
 * Product Model
 * Represents a product configuration in the system
 */
export default class Product implements IProduct {
  product_id: number | null;
  km_item_id: number;
  product_type_id: number;
  class_id: number | null;
  company_id: number | null;
  admin_id: number;
  parent_id: number | null;
  model: string;
  description: string | null;
  specifications: string | any;
  warranty_period: string | null;
  product_code: string;
  factory_code: string | null;
  sku: string;
  isbn: string;
  barcode: string;
  track_stock: boolean;
  stock_quantity: number;
  stock_status_id: number;
  lead_days: number;
  melbourne_lead_days: number;
  safety_stock: number;
  qty_alert: number;
  manufacturer_id: number | null;
  vendor_id: number | null;
  import_vendor_id: number | null;
  factory_vendor_id: number | null;
  product_range_id: number | null;
  product_category_id: number;
  edgetape_colour_id: number | null;
  requires_shipping: boolean;
  tax_type_id: number | null;
  material: string;
  weight: string | null;
  weight_type_id: number | null;
  length: string | null;
  length_type_id: number | null;
  width: string | null;
  height: string | null;
  depth: string | null;
  carton_qm: number | null;
  size: number | null;
  carton_width: number;
  carton_depth: number;
  carton_height: number;
  gross_weight: number | null;
  date_available: string | null;
  template: string;
  views: number;
  subtract_stock: boolean;
  status: boolean;
  is_featured: boolean;
  sort_order: number;
  project_price_qty: number | null;
  project_price_discount: number | null;
  active: boolean;
  archive: boolean;
  created_at: string;
  updated_at: string;
  min_order_quantity: number;
  out_of_stock_status: string;
  length_class: string;
  weight_class: string;
  tags: any[];
  categories: ICategory[];
  content: ProductContent;
  feature_description: string;
  promotions: ProductPromotion[] | [];
  // options: ProductOption[];
  attributes: ProductAttribute[];
  configuration: ProductConfiguration;
  manufacturer: Manufacturer | null;
  vendor: Vendor | null;
  stockStatus: StockStatus | null;
  variantProducts: IProduct[];
  relatedProducts: IProduct[];
  relatedProjects: RelatedProjects[];
  relatedResources: RelatedResources[];
  familyProducts: IProduct[];
  digitalAssets: DigitalAsset[] | [];
  // inventory: ProductInventory;
  shipping: ProductShipping;
  productSeo: ProductSeo;
  image: ProductImage[] | [];
  image_banner: ProductImage[] | [];
  feature_image: ProductImage[] | [];
  banner_image: ProductImage[] | [];
  image_thumb: ProductImage[] | [];
  main_image_one: ProductImage[] | [];
  main_image_one_description: string;
  main_image_two: ProductImage[] | [];
  main_image_two_description: string;
  feature_image_one: ProductImage[] | [];
  feature_image_one_description: string;
  feature_image_two: ProductImage[] | [];
  feature_image_two_description: string;
  feature_image_three: ProductImage[] | [];
  specifications_image: ProductImage[] | [];
  dimension_image: ProductImage[] | [];
  feature_image_three_description: string;
  images: IFileModel[] | [];
  certificates: IFileModel[] | [];
  resources: IFileModel[] | [];
  metadata: any;
  price: number;
  old_price: number;

  productVariants: IProductVariant[];
  productOptionGroups: IProductOptionGroup[];
  productOptions: IProductOption[];

  items: IProductItem[];
  banner_way_points: any[];
  ocean_plastic_used: boolean;
  show_configurator: boolean;
  store_link: string;
  catalogue_link: string;
  video_url: string[];

  main_image_one_title: string | null;
  main_image_two_title: string | null;
  feature_image_one_title: string | null;
  feature_image_two_title: string | null;
  feature_image_three_title: string | null;


  /**
   * Creates a new Product instance
   * @param {Partial<IProduct>} data - Product data
   */
  constructor(data: Partial<IProduct> = {}) {
    this.product_id = data.product_id ?? null;
    this.banner_way_points = data.banner_way_points ?? [];
    this.ocean_plastic_used = data.ocean_plastic_used ?? false;
    this.show_configurator = data.show_configurator ?? false;
    this.km_item_id = data.km_item_id ?? 0; // 100
    this.product_type_id = data.product_type_id ?? 1;
    this.class_id = data.class_id ?? 0; // 2
    this.company_id = data.company_id ?? 0; // 2
    this.admin_id = data.admin_id ?? 0; // 2
    this.parent_id = data.parent_id ?? null;
    this.model = data.model ?? '';
    this.feature_description = data.feature_description ?? "";
    this.description = data.description ?? ""; // This is a product description
    this.specifications = data.specifications ?? ""; // This is a product specifications
    this.warranty_period = data.warranty_period ?? ""; // Warranty
    this.product_code = data.product_code ?? ""; // ALEX-1234
    this.factory_code = data.factory_code ?? ""; // factory code
    this.sku = data.sku ?? ""; // sku-12
    this.isbn = data.isbn ?? ""; // isbn-12
    this.barcode = data.barcode ?? ""; // barcode
    this.track_stock = data.track_stock ?? false;
    this.stock_quantity = data.stock_quantity ?? 0; // 10
    this.stock_status_id = data.stock_status_id ?? 0; // 2
    this.lead_days = data.lead_days ?? 0;
    this.melbourne_lead_days = data.melbourne_lead_days ?? 0;
    this.safety_stock = data.safety_stock ?? 0;
    this.qty_alert = data.qty_alert ?? 5;
    this.manufacturer_id = data.manufacturer_id ?? null;
    this.vendor_id = data.vendor_id ?? null;
    this.import_vendor_id = data.import_vendor_id ?? null;
    this.factory_vendor_id = data.factory_vendor_id ?? null;
    this.product_range_id = data.product_range_id ?? null;
    this.product_category_id = data.product_category_id ?? 0;
    this.edgetape_colour_id = data.edgetape_colour_id ?? null;
    this.requires_shipping = data.requires_shipping ?? false;
    this.tax_type_id = data.tax_type_id ?? null;
    this.material = data.material ?? '';
    this.weight = data.weight ?? 1.0;
    this.weight_type_id = data.weight_type_id ?? null;
    this.length = data.length ?? 0; // 100
    this.length_type_id = data.length_type_id ?? null;
    this.width = data.width ?? 0; // 100
    this.height = data.height ?? 0; // 100
    this.depth = data.depth ?? 0; // 100
    this.carton_qm = data.carton_qm ?? null;
    this.size = data.size ?? null;
    this.carton_width = data.carton_width ?? 0; // 100
    this.carton_depth = data.carton_depth ?? 0; // 100
    this.carton_height = data.carton_height ?? 0; // 100
    this.gross_weight = data.gross_weight ?? 1.0;
    this.date_available = data.date_available ?? ""; // 2025-01-01
    this.template = data.template ?? ""; // default
    this.views = data.views ?? 0;
    this.subtract_stock = data.subtract_stock ?? false;
    this.status = data.status ?? true;
    this.is_featured = !!data.is_featured;
    this.sort_order = data.sort_order ?? 0;
    this.project_price_qty = data.project_price_qty ?? null;
    this.project_price_discount = data.project_price_discount ?? null;
    this.active = data.active ?? false;
    this.archive = data.archive ?? false;
    this.created_at = data.created_at ?? ""; // 2025-01-01
    this.updated_at = data.updated_at ?? ""; // 2025-01-01
    this.min_order_quantity = data.min_order_quantity ?? 0; // 10
    this.out_of_stock_status = data.out_of_stock_status ?? ""; // In Stock
    this.length_class = data.length_class ?? ""; // Centimeter
    this.weight_class = data.weight_class ?? ""; // Kilogram
    this.content = new ProductContent(data.content);
    this.tags = data.tags ?? [];
    this.categories = data.categories ? data.categories : [];
    // this.options = data.options ?? [];
    this.attributes = data.attributes ? data.attributes : [];
    this.configuration = data.configuration ? new ProductConfiguration(data.configuration) : new ProductConfiguration();
    this.promotions = data.promotions ?? [];
    this.manufacturer = data.manufacturer ? new Manufacturer(data.manufacturer) : null;
    this.vendor = data.vendor ? new Vendor(data.vendor) : null;
    this.stockStatus = data.stockStatus ? new StockStatus(data.stockStatus) : new StockStatus();
    this.variantProducts = data.variantProducts ? data.variantProducts : [];
    this.relatedProducts = data.relatedProducts ?? [];
    this.familyProducts = data.familyProducts ?? [];
    this.relatedProjects = data.relatedProjects ?? [];
    this.relatedResources = data.relatedResources ?? [];
    this.digitalAssets = data.digitalAssets ?? [];
    this.image = data.image ?? [];
    this.image_banner = data.image_banner ?? [];
    this.feature_image = data.feature_image ?? [];
    this.banner_image = data.banner_image ?? [];
    this.image_thumb = data.image_thumb ?? [];
    this.main_image_one = data.main_image_one ?? [];
    this.main_image_one_description = data.main_image_one_description ?? '';
    this.main_image_two = data.main_image_two ?? [];
    this.main_image_two_description = data.main_image_two_description ?? '';
    this.feature_image_one = data.feature_image_one ?? [];
    this.feature_image_one_description = data.feature_image_one_description ?? '';
    this.feature_image_two = data.feature_image_two ?? [];
    this.feature_image_three = data.feature_image_three ?? [];
    this.specifications_image = data.specifications_image ?? [];
    this.dimension_image = data.dimension_image ?? [];
    this.feature_image_two_description = data.feature_image_two_description ?? '';
    this.feature_image_three_description = data.feature_image_three_description ?? '';
    this.store_link = data.store_link ?? '';
    this.catalogue_link = data.catalogue_link ?? '';
    this.video_url = [];
    this.main_image_one_title = data.main_image_one_title ?? '';
    this.main_image_two_title = data.main_image_two_title ?? '';
    this.feature_image_one_title = data.feature_image_one_title ?? '';
    this.feature_image_two_title = data.feature_image_two_title ?? '';
    this.feature_image_three_title = data.feature_image_three_title ?? '';


    // this.productVariants = data.productVariants ? data.productVariants : [];
    // this.productOptionGroups = Array.isArray(data.productOptionGroups) ? data.productOptionGroups : [];
    // this.productOptions = Array.isArray(data.productOptions) ? data.productOptions : [];

    this.productVariants = Array.isArray(data.productVariants) ? data.productVariants.map(variant => new ProductVariant(variant)) : [];
    this.productOptionGroups = Array.isArray(data.productOptionGroups) ? data.productOptionGroups.map(group => new ProductOptionGroup(group)) : [];
    this.productOptions = Array.isArray(data.productOptions) ? data.productOptions.map(option => new ProductOption(option)) : [];
    this.items = Array.isArray(data.items) ? data.items.map(item => new ProductItem(item)) : [];


    try {
      let images = data.images;
      if (typeof images === 'string') {
        images = JSON.parse(images);
      }
      this.images = Array.isArray(images) ? images.map((imgItem: any) => new FileModel(imgItem)) : [];
    } catch (error) {
      console.warn('Error parsing images data:', error);
      this.images = [];
    }
    // this.certificates = data.certificates ?? [];
    try {
      let certificates = data.certificates;
      if (typeof certificates === 'string') {
        certificates = JSON.parse(certificates);
      }
      this.certificates = Array.isArray(certificates) ? certificates.map((imgItem: any) => new FileModel(imgItem)) : [];
    } catch (error) {
      console.warn('Error parsing images data:', error);
      this.certificates = [];
    }

    try {
      let resources = data.resources;
      if (typeof resources === 'string') {
        resources = JSON.parse(resources);
      }
      this.resources = Array.isArray(resources) ? resources.map((imgItem: any) => new FileModel(imgItem)) : [];
    } catch (error) {
      console.warn('Error parsing images data:', error);
      this.resources = [];
    }
    try {
      let videoUrls: any = data.video_url;
      if (typeof videoUrls === 'string') {
        videoUrls = JSON.parse(videoUrls);
      }
      this.video_url = Array.isArray(videoUrls)
        ? videoUrls.filter((url) => typeof url === 'string')
        : [];
    } catch (error) {
      console.warn('Error parsing video_url data:', error);
      this.video_url = [];
    }
    // this.inventory = data.inventory ? new ProductInventory(data.inventory) : new ProductInventory();
    this.shipping = data.shipping ? new ProductShipping(data.shipping) : new ProductShipping();
    this.productSeo = data.productSeo ? new ProductSeo(data.productSeo) : new ProductSeo();

    const defaultMetadata = {
      enSeo: {
        meta_keywords: '',
        meta_description: '',
        meta_content: '',
      },
      openGraph: {
        openGraphTitle: '',
        openGraphDescription: '',
      },
      twitter: {
        twitterTitle: '',
        twitterDescription: '',
        twitterLabel1: '',
        twitterLabel2: '',
        twitterData1: '',
        twitterData2: '',
      },
    };

    let metadata = data.metadata;
    if (typeof metadata === 'string') {
      try {
        metadata = JSON.parse(metadata);
      } catch {
        metadata = {};
      }
    }

    this.metadata = {
      ...defaultMetadata,
      ...(metadata ?? {}),
      enSeo: {
        ...defaultMetadata.enSeo,
        ...(metadata?.enSeo ?? {}),
      },
      openGraph: {
        ...defaultMetadata.openGraph,
        ...(metadata?.openGraph ?? {}),
      },
      twitter: {
        ...defaultMetadata.twitter,
        ...(metadata?.twitter ?? {}),
      },
    };
    this.price = data.price ?? 0;
    this.old_price = data.old_price ?? 0;
  }

  /**
   * Create a Product instance from a plain object
   * @param {Partial<IProduct>} data - Plain object containing product data
   * @returns {Product} New Product instance
   */
  static fromJSON(data: Partial<IProduct>): Product {
    return new Product(data);
  }
} 