import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import ProductTypeService from '../service/ProductTypeService';
// import ProductTypeFilter from '../filters/ProductTypeFilter';
import ProductType from '../models/ProductType';
import FeedbackHandler from '../utils/FeedbackHandler';
import ProductTypeImportResponse from '../models/ProductTypeImport';
import { FileModel } from '@/models/Media';
import ProductTypeFilter from '@/filters/ProductTypeFilter';


export const useProductTypeStore = defineStore('productType', () => {
    /**
     * @type {import('vue').Ref<ProductType[]>}
     */
    const productTypes = ref([]);
    const newProductType = ref(new ProductType());

    const filter = ref(new ProductTypeFilter());
    
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'productType';
    const importExport = ref(new ProductTypeImportResponse());

    const resetProductType = () => {
        newProductType.value = new ProductType();
    };

    const fetchProductTypes = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await ProductTypeService.getProductTypes();
            productTypes.value = response.map(productType => new ProductType(productType));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const fetchProductTypeById = async (productTypeId) => {
        fb.value.clearError(model + '.edit.' + productTypeId);
        fb.value.removeSuccess(model + '.edit.' + productTypeId);
        fb.value.startLoading(model + '.edit.' + productTypeId);
        try {
            const productType = await ProductTypeService.getProductTypeById(productTypeId);
            newProductType.value = new ProductType(productType);
            fb.value.showSuccess(model + '.edit.' + productTypeId);
            return newProductType.value;
        } catch (err) {
            fb.value.setError(err, model + '.edit.' + productTypeId);
        } finally {
            fb.value.finishLoading(model + '.edit.' + productTypeId);
        }
    };

    const createProductType = async (newProductType) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdProductType = await ProductTypeService.createProductType(newProductType);
            newProductType.value = new ProductType(createdProductType);
            fb.value.showSuccess(model + '.create');
            return newProductType.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateProductType = async (productTypeId, updatedProductType) => {
        fb.value.clearError(model + '.update.' + productTypeId);
        fb.value.removeSuccess(model + '.update.' + productTypeId);
        fb.value.startLoading(model + '.update.' + productTypeId);
        try {
            const productType = await ProductTypeService.updateProductType(productTypeId, updatedProductType);
            const index = productTypes.value.findIndex(p => p.product_type_id === productTypeId);
            if (index !== -1) {
                productTypes.value[index] = productType;
            }
            fb.value.showSuccess(model + '.update.' + productTypeId);
            return productType;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + productTypeId);
        } finally {
            fb.value.finishLoading(model + '.update.' + productTypeId);
        }
    };

    const deleteProductType = async (productTypeId) => {
        fb.value.clearError(model + '.delete.' + productTypeId);
        fb.value.removeSuccess(model + '.delete.' + productTypeId);
        fb.value.startLoading(model + '.delete.' + productTypeId);
        try {
            await ProductTypeService.deleteProductType(productTypeId);
            productTypes.value = productTypes.value.filter(p => p.product_type_id !== productTypeId);
            fb.value.showSuccess(model + '.delete.' + productTypeId);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + productTypeId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + productTypeId);
        }
    };

    // import taxonomies csv
    const productTypeImport = async (formData) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!formData) {
                throw new Error('No file data provided to import taxonomies');
            }
            const response = await ProductTypeService.productTypeImport(formData);
            console.log('Store received response:', response);
            importExport.value = new ProductTypeImportResponse(response);
            fb.value.showSuccess(model + '.import');
            return response;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model + '.import');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.import');
        }
    };

    const uploadProductTypeImages = async (files, property, productTypeId) => {
        fb.value.clearError('media.files.upload.'+property);
        fb.value.removeSuccess('media.files.upload.'+property);
        fb.value.startLoading('media.files.upload.'+property);
        try {
            const response = await ProductTypeService.uploadProductTypeImages(files, property, productTypeId);
            newProductType.value.image = response.files.map(item => new FileModel(item));
            fb.value.showSuccess('Files uploaded successfully', 'media.files.upload.'+property);
            return response;
        } catch (err) {
            fb.value.setError(err, 'media.files.upload.'+property);
            throw err;
        } finally {
            fb.value.finishLoading('media.files.upload.'+property);
        }
    };

    const deleteProductTypeImages = async (file, productTypeId) => {
        fb.value.clearError('media.files.delete.'+productTypeId);
        fb.value.removeSuccess('media.files.delete.'+productTypeId);
        fb.value.startLoading('media.files.delete.'+productTypeId);
        try {
            const response = await ProductTypeService.deleteProductTypeImages(file, productTypeId);
            newProductType.value.image = [];
            fb.value.showSuccess('media.files.delete.'+productTypeId);
            return response;
        } catch (err) {
            fb.value.setError(err, 'media.files.delete.'+productTypeId);
            throw err;
        } finally {
            fb.value.finishLoading('media.files.delete.'+productTypeId);
        }
    };

    return { 
        productTypes, 
        newProductType,
        filter,
        fb,
        importExport,
        fetchProductTypes, 
        resetProductType,
        fetchProductTypeById, 
        createProductType, 
        updateProductType, 
        deleteProductType,
        productTypeImport,
        uploadProductTypeImages,
        deleteProductTypeImages
    };
}); 