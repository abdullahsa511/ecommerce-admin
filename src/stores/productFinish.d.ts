import { ProductFinish } from '@/models/ProductFinish';
import { ProductFinishFilter } from '@/filters/ProductFinishFilter';
import { StoreDefinition } from 'pinia';

export interface ProductFinishState {
  productFinishes: ProductFinish[];
  filter: ProductFinishFilter;
  fb: any;
}

export interface ProductFinishActions {
  createProductFinish: (finish: ProductFinish) => Promise<void>;
  updateProductFinish: (finishId: string, finish: ProductFinish) => Promise<void>;
  deleteProductFinish: (finishId: string) => Promise<void>;
  fetchProductFinishes: () => Promise<void>;
  fetchProductFinishById: (finishId: string) => Promise<ProductFinish>;
}

export interface ProductFinishStore extends ProductFinishState, ProductFinishActions {}

export declare const useProductFinishStore: StoreDefinition<'productFinish', ProductFinishState, {}, ProductFinishActions>;
