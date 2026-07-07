import { ProductTag } from '@/models/ProductTag';
import { ProductTagFilter } from '@/filters/ProductTagFilter';
import { StoreDefinition } from 'pinia';

export interface ProductTagState {
  productTags: ProductTag[];
  newTag: ProductTag;
  filter: ProductTagFilter;
  fb: any;
}

export interface ProductTagActions {
  resetProductTag: () => void;
  createProductTag: (tag: ProductTag) => Promise<void>;
  updateProductTag: (tagId: string, tag: ProductTag) => Promise<void>;
  deleteProductTag: (tagId: string) => Promise<void>;
  fetchProductTags: () => Promise<void>;
  fetchProductTagById: (tagId: string) => Promise<ProductTag>;
}

export interface ProductTagStore extends ProductTagState, ProductTagActions {}

export declare const useProductTagStore: StoreDefinition<'productTag', ProductTagState, {}, ProductTagActions>; 