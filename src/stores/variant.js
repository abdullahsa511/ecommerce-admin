import { ref } from 'vue';
import { defineStore } from 'pinia';
import ImportExport from '../models/ImportExport';
import FeedbackHandler from '../utils/FeedbackHandler';
import Variant from '@/models/Variant';
import VariantService from '@/service/VariantService';
import ProductService from '@/service/ProductService';
import { ProductVariant } from '@/models/Product.ts';

export const useVariantStore = defineStore('variant', () => {
    const variants = ref([]);
    const variant = ref(new ProductVariant());

    /**
     * @type {import('vue').Ref<ImportExport[]>}
     */
    const importExport = ref([]);

    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'variant';

    const products = ref([]);


    const resetVariants = () => {
        variant.value = new ProductVariant();
    };

    const fetchProducts = async () => {
        const response = await ProductService.getProducts();
        let localProducts = response.map(product => ({ label: product.product_code, value: product.product_id }));
        products.value = localProducts;
    };

    const getVariants = async () => {
        fb.value.clearError(model + '.get');
        fb.value.removeSuccess(model + '.get');
        fb.value.startLoading(model + '.get');
        try {
            const data = await VariantService.getVariants();
            variants.value = data.map(variant => new ProductVariant(variant));
            fb.value.showSuccess(model + '.get');
            return data; //
        } catch (err) {
            console.error('Error fetching variants:', err);
            fb.value.setError(err, model + '.get');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.get');
        }
    };

    const createVariant = async (newVariant) => {
        console.log('newVariant on createVariant', newVariant);
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const variant = await VariantService.createVariant(newVariant);
            const variantObj = new ProductVariant(variant);
            variantObj.value = variantObj;
            fb.value.showSuccess(model + '.create');
            return variantObj.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }   
    };

    const getVariantById = async (id) => {
        fb.value.clearError(model + '.show');
        fb.value.removeSuccess(model + '.show');
        fb.value.startLoading(model + '.show');
        try {
            const response = await VariantService.getVariantById(id);
            variant.value = new ProductVariant(response);
            fb.value.showSuccess(model + '.show');
            return response;
        } catch (err) {
            console.error('Error fetching variant:', err);
            fb.value.setError(err, model + '.show');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.show');
        }
    };

    const updateVariant = async (updatedVariant) => {   
        console.log('updatedVariant on updateVariant', updatedVariant);     
        fb.value.clearError(model + '.update.' + updatedVariant.product_variant_id);
        fb.value.removeSuccess(model + '.update.' + updatedVariant.product_variant_id);
        fb.value.startLoading(model + '.update.' + updatedVariant.product_variant_id);
        
        try {
            const vaa = await VariantService.updateVariant(updatedVariant);
            const variantObj = new ProductVariant(vaa);
            fb.value.showSuccess(model + '.update.' + updatedVariant.product_variant_id);
            return variantObj;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + updatedVariant.product_variant_id);
         
        } finally {
            fb.value.finishLoading(model + '.update.' + updatedVariant.product_variant_id);
        }   
    };

    const deleteVariant = async (variantId) => {
        fb.value.clearError(model + '.delete.'+ variantId);
        fb.value.removeSuccess(model + '.delete.'+ variantId);
        fb.value.startLoading(model + '.delete.'+ variantId);
        try {
            await VariantService.deleteVariant(variantId);
            variants.value = variants.value.filter(p => p.variant_id !== variantId);
            fb.value.showSuccess(model + '.delete.'+ variantId);
            return variantId;
        } catch (err) {
            fb.value.setError(err, model + '.delete.'+ variantId);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.delete.'+ variantId);
        }
    };

    const importVariants = async (newImport) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await VariantService.importVariants(newImport);
            console.log('Store received response:', response);
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


    return {
        variants,
        variant,
        fb,
        model,
        importExport,
        products,
        resetVariants,
        fetchProducts,
        getVariants,
        createVariant,
        getVariantById,
        updateVariant,
        deleteVariant,
        importVariants,
    };
});
