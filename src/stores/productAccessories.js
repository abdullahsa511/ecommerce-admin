import { ref } from 'vue';
import { defineStore } from 'pinia';
import FeedbackHandler from '@/utils/FeedbackHandler';
// import ProductAccessories from '@/models/ProductAccessories';
import { ProductAccessories } from '@/models/Product.ts';
import ProductService from '@/service/ProductService';
import VariantService from '@/service/VariantService';
import ProductAccessoriesService from '@/service/ProductAccessoriesService';

export const useProductAccessoriesStore = defineStore('productAccessories', () => {
    const productAccessoriess = ref([]);
    const productAccessories = ref(new ProductAccessories());
    const importExport = ref([]);
    const fb = ref(new FeedbackHandler());
    const model = 'productAccessories';
    const products = ref([]);
    const productVariants = ref([]);
    const productAccessoriesGroups = ref([]);

    const resetProductAccessories = () => {
        productAccessories.value = new ProductAccessories();
    };

    const getProductAccessoriess = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await ProductAccessoriesService.getProductAccessoriess();
            productAccessoriess.value = response.map(opt => new ProductAccessories(opt));
            productAccessories.value.sort_order = productAccessoriess.value[productAccessoriess.value.length - 1].sort_order + 1;
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await ProductService.getProductList();
            products.value = response.map(product => ({
                id: product.product_id,
                name: product.product_code
            }));
        } catch (err) {
            fb.value.setError(err, model + '.products');
        }
    };

    const fetchProductVariants = async () => {
        try {
            const response = await VariantService.getVariants();
            productVariants.value = response.map(variant => ({ id: variant.product_variant_id, name: variant.variant_name }));
        } catch (err) {
            fb.value.setError(err, model + '.variants');
        }
    };


    const createProductAccessories = async (newProductAccessories) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdProductAccessories = await ProductAccessoriesService.createProductAccessories(newProductAccessories);
            productAccessories.value = new ProductAccessories(createdProductAccessories);
            fb.value.showSuccess(model + '.create');
            return productAccessories.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if (!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const getProductAccessoriesById = async (id) => {
        fb.value.clearError(model + '.edit.' + id);
        fb.value.removeSuccess(model + '.edit.' + id);
        fb.value.startLoading(model + '.edit.' + id);
        try {
            const response = await ProductAccessoriesService.getProductAccessoriesById(id);
            productAccessories.value = new ProductAccessories(response);
            fb.value.showSuccess(model + '.edit.' + id);
            return response;
        } catch (err) {
            fb.value.setError(err, model + '.edit.' + id);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.edit.' + id);
        }
    };

    const updateProductAccessories = async (updatedProductAccessories) => {
        fb.value.clearError(model + '.update.' + updatedProductAccessories.product_accessories_id);
        fb.value.removeSuccess(model + '.update.' + updatedProductAccessories.product_accessories_id);
        fb.value.startLoading(model + '.update.' + updatedProductAccessories.product_accessories_id);
        try {
            const response = await ProductAccessoriesService.updateProductAccessories(updatedProductAccessories);
            productAccessories.value = new ProductAccessories(response);
            fb.value.showSuccess(model + '.update.' + updatedProductAccessories.product_accessories_id);
            return response;
        } catch (err) {
            let error = err.response?.data?.errors;
            if (!error) error = err;
            fb.value.setError(error, model + '.update.' + updatedProductAccessories.product_accessories_id);
        } finally {
            fb.value.finishLoading(model + '.update.' + updatedProductAccessories.product_accessories_id);
        }
    };

    const deleteProductAccessories = async (id) => {
        fb.value.clearError(model + '.delete.' + id);
        fb.value.removeSuccess(model + '.delete.' + id);
        fb.value.startLoading(model + '.delete.' + id);
        try {
            await ProductAccessoriesService.deleteProductAccessories(id);
            productAccessoriess.value = productAccessoriess.value.filter(p => p.product_accessories_id !== id);
            fb.value.showSuccess(model + '.delete.' + id);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + id);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.delete.' + id);
        }
    };

    const productAccessoriessImport = async (newImport) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await ProductAccessoriesService.productAccessoriessImport(newImport);
            importExport.value.push(response);
            fb.value.showSuccess(model + '.import');
            return response;
        } catch (err) {
            fb.value.setError(err, model + '.import');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.import');
        }
    };

    return {
        productAccessoriess,
        productAccessories,
        fb,
        model,
        importExport,
        products,
        productVariants,
        productAccessoriesGroups,
        getProductAccessoriess,
        fetchProducts,
        fetchProductVariants,
        createProductAccessories,
        updateProductAccessories,
        getProductAccessoriesById,
        deleteProductAccessories,
        productAccessoriessImport,
        resetProductAccessories,
    };
});