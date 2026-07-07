import { ref } from 'vue';
import { defineStore } from 'pinia';
import ImportExport from '../models/ImportExport';
import FeedbackHandler from '../utils/FeedbackHandler';
import { ProductOptionGroup } from '@/models/Product.ts';
import ProductOptionGroupService from '@/service/ProductOptionGroupService';
import ProductService from '@/service/ProductService';
import VariantService from '@/service/VariantService';
import ProductOptionService from '@/service/ProductOptionService';

export const useProductOptionGroupStore = defineStore('productOptionGroup', () => {
    const productOptionGroups = ref([]);
    const productOptionGroup = ref(new ProductOptionGroup());
    const optionGroup = ref(new ProductOptionGroup());

    /**
     * @type {import('vue').Ref<ImportExport[]>}
     */
    const importExport = ref([]);

    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'productOptionGroup';
    const products = ref([]);
    const productVariants = ref([]);

    const fetchProducts = async () => {
        const response = await ProductService.getProducts();
        let localProducts = response.map(product => ({ label: product.product_code, value: product.product_id }));
        products.value = localProducts;
    };
    const fetchProductVariants = async () => {
        const response = await VariantService.getVariants();
        let localProductVariants = response.map(productVariant => ({ label: productVariant.variant_name, value: productVariant.product_variant_id }));
        productVariants.value = localProductVariants;
    };

    const resetProductOptionGroup = () => {
        productOptionGroup.value = new ProductOptionGroup();
    };

    const getProductOptionGroups = async () => {
        fb.value.clearError(model + '.get');
        fb.value.removeSuccess(model + '.get');
        fb.value.startLoading(model + '.get');
        try {
            const data = await ProductOptionGroupService.getOptionGroups();
            productOptionGroups.value = data.map(productOptionGroup => new ProductOptionGroup(productOptionGroup));
            fb.value.showSuccess(model + '.get');
            return data; //
        } catch (err) {
            console.error('Error fetching option groups:', err);
            fb.value.setError(err, model + '.get');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.get');
        }
    };

    const createProductOptionGroup = async (newOptionGroup) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const res = await ProductOptionGroupService.createOptionGroup(newOptionGroup);
            const productOptionGroupObj = new ProductOptionGroup(res);
            productOptionGroup.value = productOptionGroupObj;
            fb.value.showSuccess(model + '.create');
            return productOptionGroup.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }   
    };

    const updateProductOptionGroup = async (updateData) => {
        fb.value.clearError(model + '.update.'+updateData.product_option_group_id);
        fb.value.removeSuccess(model + '.update.'+updateData.product_option_group_id);
        fb.value.startLoading(model + '.update.'+updateData.product_option_group_id);
        try {
            const res = await ProductOptionGroupService.updateProductOptionGroup(updateData);
            productOptionGroup.value = new ProductOptionGroup(res);
            fb.value.showSuccess(model + '.update.' + updateData.product_option_group_id);
            return productOptionGroup.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + updateData.product_option_group_id);

        } finally {
            fb.value.finishLoading(model + '.update.'+updateData.product_option_group_id);
        }
    };

    const getProductOptionGroupById = async (id) => {
        fb.value.clearError(model + '.show');
        fb.value.removeSuccess(model + '.show');
        fb.value.startLoading(model + '.show');
        try {
            // const res = await ProductOptionGroupService.getProductOptionGroupById(id);
            const res = await ProductService.getProductOptionGroupById(id);
            productOptionGroup.value = new ProductOptionGroup(res);
            fb.value.showSuccess(model + '.show');
            return productOptionGroup.value;
        } catch (err) {
            fb.value.setError(err, model + '.show');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.show');
        }   
    };

    const deleteProductOptionGroup = async (productOptionGroupId) => {
        fb.value.clearError(model + '.delete.'+productOptionGroupId);
        fb.value.removeSuccess(model + '.delete.'+productOptionGroupId);
        fb.value.startLoading(model + '.delete.'+productOptionGroupId);
        try {
            await ProductOptionGroupService.deleteOptionGroup(productOptionGroupId);
            productOptionGroups.value = productOptionGroups.value.filter(p => p.product_option_group_id !== productOptionGroupId);
            fb.value.showSuccess(model + '.delete.'+productOptionGroupId);
            return productOptionGroupId;
        } catch (err) {
            fb.value.setError(err, model + '.delete.'+productOptionGroupId);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.delete.'+productOptionGroupId);
        }
    };

    const deleteProductOption = async (id) => {
        fb.value.clearError(model + '.delete.' + id);
        fb.value.removeSuccess(model + '.delete.' + id);
        fb.value.startLoading(model + '.delete.' + id);
        try {
            await ProductOptionService.deleteProductOption(id);
            productOptionGroup.value.productOptions = productOptionGroup.value.productOptions.filter(p => p.product_option_id !== id);
            fb.value.showSuccess(model + '.delete.' + id);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + id);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.delete.' + id);
        }
    };

    const importOptionGroups = async (newImport) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await ProductOptionGroupService.importOptionGroups(newImport);
            importExport.value.push(response);
            fb.value.showSuccess(model + '.import');
            return response;
        } catch (err) {
            console.error('Import error for option groups:', err);
            fb.value.setError(err, model + '.import');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.import');
        }
    };

    return {
        productOptionGroups,
        productOptionGroup,
        optionGroup,
        fb,
        model,
        importExport,
        products,
        productVariants,
        fetchProducts,
        fetchProductVariants,
        resetProductOptionGroup,
        getProductOptionGroups,
        createProductOptionGroup,
        updateProductOptionGroup,
        getProductOptionGroupById,
        deleteProductOptionGroup,
        deleteProductOption,
        importOptionGroups,
    };
});
