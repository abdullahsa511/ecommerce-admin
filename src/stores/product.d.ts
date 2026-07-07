import Component from '@/models/Component';
import { FileToUpload } from '@/models/File';
// import { FeedbackHandler } from '@/utils/FeedbackHandler';
import FeedbackHandler from '@/utils/FeedbackHandler';

import { Ref } from 'vue';
import { defineStore } from 'pinia';
import ProductImportResponse from '@/models/ProductImportResponse';
import { FileModel } from '@/models/Media';
import Product from '@/models/Product';


export interface ProductState {
  products: Product[];
  product: Product;
  importExport: ProductImportResponse;
  // fb: Ref<FeedbackHandler>;
  fb: FeedbackHandler;
  categories: any[];
  productLists: any[];

  productVariants: Ref<ProductVariant[]>;
  productOptionGroups: any[];
  productOptions: any[];
}

export const useProductStore = defineStore('product', {
  state: (): ProductState => ({
    products: [],
    product: new Product(),
    importExport: new ProductImportResponse(),
    // fb: ref(new FeedbackHandler()),
    fb: new FeedbackHandler(),
    categories: [],
    productLists: [],

    productVariants: ref([]),
    productOptionGroups: [],
    productOptions: []
  }),
  actions: {
    async fetchProducts() {},

    async listProductVariants(query: string, productId: number | string): Promise<any> {},
    async listProductOptionGroups(query: string, productId: number | string): Promise<any> {},
    async listProductOptions(query: string, optionGroupId: number | string): Promise<any> {},
    async listItemOptions(query: string, productId: number | string): Promise<any> {},
    async createProductVariant(data: any): Promise<any> {},
    async updateProductVariant(data: any): Promise<any> {},
    async uploadProductVariantImage(files: FileToUpload[], productVariantId: number | string): Promise<FileModel[]> {},
    async deleteProductVariant(productVariantId: number | string): Promise<any> {},
    async deleteProductOption(id: number | string) { },
    async uploadProductVariantGroupOptionImage(files: FileToUpload[], productOptionId: number | string): Promise<FileModel[]> {},
    async deleteProductVariantImage(productOptionId: number | string): Promise<any> {},
    async deleteProductVariantOptionImage(productOptionId: number | string): Promise<any> {},

    async fetchProductById(productId: number | string): Promise<Product | any> {},
    async createProduct(newProduct: Product): Promise<Product | any> {},
    async updateProduct(updatedProduct: Product) {},
    async deleteProduct(productId: number | string) {},
    async getCategories() {},
    async productList() {},
    async listTypes(query: string): Promise<any> {},
    async searchProducts(query: string): Promise<Product[]> {},
    async searchProjects(query: string): Promise<any[]> {},
    async searchResources(query: string): Promise<any[]> {},
    async searchProductVariants(query: string): Promise<Product[]> {},
    async searchDigitalAssets(query: string): Promise<DigitalAsset[]> {},
    async getOptionList(): Promise<ProductOption[]> {},
    async uploadProductImages(files: FileToUpload[], property: string, productId: number | string): Promise<ProductImage[]> {},
    async deleteImageByFilePath(filepath: string): Promise<any> {},
    async deleteProductImage(imageId: number | string): Promise<any> {},
    async deleteProductDownload(design_resource_document_id: number | string): Promise<any> {},
    async deleteRelatedProduct(productId: number | string, relatedProductId: number | string): Promise<any> {},
    async removeProductFromFamily(productId: number | string, relatedProductId: number | string): Promise<any> {},
    async removeRelatedProject(productId: number | string, projectId: number | string): Promise<any> {},
    async removeRelatedResource(productId: number | string, resourceId: number | string): Promise<any> {},
    async getVariantsOptionsByProductId(productId: number | string): Promise<ProductVariant[]> {},
    async getVariantById(variantId: number | string): Promise<ProductVariant> {},
    async deleteProductOptionGroup(productOptionGroupId: number | string): Promise<any> {},
    async getItemVariantOptionByItemId(itemId: number | string): Promise<ProductVariant[]> {},
    async createItemVariant(data: any): Promise<any> {},
    async updateItemVariant(data: any): Promise<any> {},
    async deleteItemOption(itemOptionId: number | string, groupId: number | string): Promise<any> {},
    async deleteItemOptionGroup(group: any): Promise<any> {},

    async updateProductWayPoints(productId: number | string, wayPoints: any) : Object {},
    async getWayPointSuggestions(query: string): Promise<any[]> {},
    async removeProductWayPoint(productId: number | string, pointId: number | string) : Object {},
    
    async deleteGalleryImage(files: Product[], property: string): Promise<any> {},
    async deleteCertificates(files: Product[], property: string, productId: number): Promise<any> {},
    async deleteResources(files: Product[], property: string): Promise<any> {},
    async updateDocumentFormat(file: { design_resource_document_id: number; format: string }): Promise<any> {},
  }
}); 