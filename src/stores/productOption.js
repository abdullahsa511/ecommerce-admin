import { ref } from 'vue';
import { defineStore } from 'pinia';
import FeedbackHandler from '@/utils/FeedbackHandler';
// import ProductOption from '@/models/ProductOption';
import { ProductOption } from '@/models/Product.ts';
import ProductOptionService from '@/service/ProductOptionService';
import ProductService from '@/service/ProductService';
import VariantService from '@/service/VariantService';
import ProductOptionGroupService from '@/service/ProductOptionGroupService';

export const useProductOptionStore = defineStore('productOption', () => {
    const productOptions = ref([]);
    const productOption = ref(new ProductOption());
    const importExport = ref([]);
    const fb = ref(new FeedbackHandler());
    const model = 'productOption';
    const products = ref([]);
    const productVariants = ref([]);
    const productOptionGroups = ref([]);

    const resetProductOption = () => {
        productOption.value = new ProductOption();
    };

    const getProductOptions = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await ProductOptionService.getProductOptions();
            productOptions.value = response.map(opt => new ProductOption(opt));
            productOption.value.sort_order = productOptions.value[productOptions.value.length - 1].sort_order + 1;
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

    const fetchProductOptionGroups = async () => {
        try {
            const response = await ProductOptionGroupService.getOptionGroups();
            productOptionGroups.value = response.map(optionGroup => ({ id: optionGroup.product_option_group_id, name: optionGroup.option_group_name }));
        } catch (err) {
            fb.value.setError(err, model + '.optionGroups');
        }
    };

    const createProductOption = async (newProductOption) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdProductOption = await ProductOptionService.createProductOption(newProductOption);
            productOption.value = new ProductOption(createdProductOption);
            fb.value.showSuccess(model + '.create');
            return productOption.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if (!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const getProductOptionById = async (id) => {
        fb.value.clearError(model + '.edit.' + id);
        fb.value.removeSuccess(model + '.edit.' + id);
        fb.value.startLoading(model + '.edit.' + id);
        try {
            // const response = await ProductOptionService.getProductOptionById(id);
            const response = await ProductService.getProductOptionById(id);
            productOption.value = new ProductOption(response);
            fb.value.showSuccess(model + '.edit.' + id);
            return response;
        } catch (err) {
            fb.value.setError(err, model + '.edit.' + id);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.edit.' + id);
        }
    };

    const updateProductOption = async (updatedProductOption) => {
        fb.value.clearError(model + '.update.' + updatedProductOption.product_option_id);
        fb.value.removeSuccess(model + '.update.' + updatedProductOption.product_option_id);
        fb.value.startLoading(model + '.update.' + updatedProductOption.product_option_id);
        try {
            const response = await ProductOptionService.updateProductOption(updatedProductOption);
            productOption.value = new ProductOption(response);
            fb.value.showSuccess(model + '.update.' + updatedProductOption.product_option_id);
            return response;
        } catch (err) {
            let error = err.response?.data?.errors;
            if (!error) error = err;
            fb.value.setError(error, model + '.update.' + updatedProductOption.product_option_id);
        } finally {
            fb.value.finishLoading(model + '.update.' + updatedProductOption.product_option_id);
        }
    };

    const deleteProductOption = async (id) => {
        fb.value.clearError(model + '.delete.' + id);
        fb.value.removeSuccess(model + '.delete.' + id);
        fb.value.startLoading(model + '.delete.' + id);
        try {
            await ProductOptionService.deleteProductOption(id);
            productOptions.value = productOptions.value.filter(p => p.product_option_id !== id);
            fb.value.showSuccess(model + '.delete.' + id);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + id);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.delete.' + id);
        }
    };

    const productOptionsImport = async (newImport) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await ProductOptionService.productOptionsImport(newImport);
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
        productOptions,
        productOption,
        fb,
        model,
        importExport,
        products,
        productVariants,
        productOptionGroups,
        getProductOptions,
        fetchProducts,
        fetchProductVariants,
        fetchProductOptionGroups,
        createProductOption,
        updateProductOption,
        getProductOptionById,
        deleteProductOption,
        productOptionsImport,
        resetProductOption,
    };
});