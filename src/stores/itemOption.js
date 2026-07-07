import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import ItemOptionService from '@/service/ItemOptionService';
// import ItemOptionFilter from '@/filters/ItemOptionFilter';
import ItemOption from '@/models/ItemOption';
import FeedbackHandler from '../utils/FeedbackHandler';
import ItemOptionImportResponse from '@/models/ItemOptionImport';
// import services
import ItemService from '@/service/ItemService';
import ProductService from '@/service/ProductService';
import VariantService from '@/service/VariantService';
import ProductOptionGroupService from '@/service/ProductOptionGroupService';
import ProductOptionService from '@/service/ProductOptionService';
import TypeService from '@/service/TypeService';
// end
import { FileModel } from '@/models/Media';
import { mediaUrl } from '@/utils/mediaUrl';


export const useItemOptionStore = defineStore('itemOption', () => {
    /**
     * @type {import('vue').Ref<ItemOption[]>}
     */
    const importExport = ref(new ItemOptionImportResponse());
    const itemOptions = ref([]);
    const itemOption = ref(new ItemOption());
    // const filter = ref(new ItemOptionFilter());
    const fb = ref(new FeedbackHandler());
    const model = 'itemOption';
    // select data for dropdown
    const items = ref([]);
    const products = ref([]);
    const productVariants = ref([]);
    const productOptionGroups = ref([]);
    const productOptions = ref([]);
    const types = ref([]);
    // end

    const resetItemOption = () => {
        itemOption.value = new ItemOption();
    };

    const fetchItemOptions = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await ItemOptionService.getItemOptions();
            itemOptions.value = response.map(itemOption => new ItemOption(itemOption));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const fetchItemOptionById = async (itemOptionId) => {
        fb.value.clearError(model + '.edit.' + itemOptionId);
        fb.value.removeSuccess(model + '.edit.' + itemOptionId);
        fb.value.startLoading(model + '.edit.' + itemOptionId);
        try {
            const response = await ItemOptionService.getItemOptionById(itemOptionId);
            console.log('response dddd', response);
            itemOption.value = new ItemOption(response);
            console.log('itemOption', itemOption.value);
            fb.value.showSuccess(model + '.edit.' + itemOptionId);
            return itemOption.value;
        } catch (err) {
            fb.value.setError(err, model + '.edit.' + itemOptionId);
        } finally {
            fb.value.finishLoading(model + '.edit.' + itemOptionId);
        }
    };

    const createItemOption = async (newItemOption) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdItemOption = await ItemOptionService.createItemOption(newItemOption);
            const itemOptionObj = new ItemOption(createdItemOption);
            itemOption.value = itemOptionObj;
            fb.value.showSuccess(model + '.create');
            return itemOption.value;
            // itemOptions.value.push(createdItemOption);
        } catch (err) {
            let error = err.response?.data?.errors;
            if (!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateItemOption = async (updatedItemOption) => {
        fb.value.clearError(model + '.update.' + updatedItemOption.item_option_id);
        fb.value.removeSuccess(model + '.update.' + updatedItemOption.item_option_id);
        fb.value.startLoading(model + '.update.' + updatedItemOption.item_option_id);
        try {
            const lt = await ItemOptionService.updateItemOption(updatedItemOption);
            const itemOptionObj = new ItemOption(lt);
            const index = itemOptions.value.findIndex(l => l.item_option_id === updatedItemOption.item_option_id);
            if (index !== -1) {
                itemOptions.value[index] = itemOptionObj;
            }
            itemOption.value = itemOptionObj;
            fb.value.showSuccess(model + '.update.' + updatedItemOption.item_option_id);
            return itemOption.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if (!error) error = err;
            fb.value.setError(error, model + '.update.' + updatedItemOption.item_option_id);
        } finally {
            fb.value.finishLoading(model + '.update.' + updatedItemOption.item_option_id);
        }
    };

    const deleteItemOption = async (itemOptionId) => {
        fb.value.clearError(model + '.delete.' + itemOptionId);
        fb.value.removeSuccess(model + '.delete.' + itemOptionId);
        fb.value.startLoading(model + '.delete.' + itemOptionId);
        try {
            await ItemOptionService.deleteItemOption(itemOptionId);
            itemOptions.value = itemOptions.value.filter(ip => ip.item_option_id !== itemOptionId);
            fb.value.showSuccess(model + '.delete.' + itemOptionId);
            return itemOptionId;
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + itemOptionId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + itemOptionId);
        }
    };

    const importItemOptions = async (newImport) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await ItemOptionService.importItemOptions(newImport);
            importExport.value = new ItemOptionImportResponse(response);
            fb.value.showSuccess(model + '.import');
            return importExport.value;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model + '.import');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.import');
        }
    };

    // fetch data from api
    const fetchItems = async () => {
        const response = await ItemService.getItems();
        items.value = response.map(item => ({ id: item.item_id, name: item.item_code }));
    };
    const fetchProducts = async () => {
        try {
            const response = await ProductService.getProductList();
            products.value = response.map(product => ({ id: product.product_id, name: product.product_code }));
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


    const fetchProductOptions = async () => {
        const response = await ProductOptionService.getProductOptions();
        productOptions.value = response.map(productOption => ({ id: productOption.product_option_id, name: productOption.option_name }));
    };
    const fetchTypes = async () => {
        const response = await TypeService.getTypes();
        types.value = response.map(type => ({ id: type.type_id, name: type.type }));
    };
    // end


    // autocompletion
    const searchProducts = async (query) => {
        const response = await ProductService.searchProducts(query);
        const data = response.map(product => ({ product_id: product.product_id, product_code: product.product_code }));
        console.log('data', data);
        return data;
    };
    const searchItems = async (query, productId) => {
        const response = await ItemService.listItems(query, productId);
        return response.map(item => ({ item_id: item.item_id, item_code: item.item_code }));
    };

    const searchProductVariants = async (query, productId) => {
        const response = await VariantService.searchProductVariants(query, productId);
        return response.map(variant => ({ product_variant_id: variant.product_variant_id, variant_name: variant.variant_name }));
    };
    const searchOptionGroups = async (query, productId, variantId) => {
        const response = await ProductOptionGroupService.searchOptionGroups(query, productId, variantId);
        return response.map(optionGroup => ({ product_option_group_id: optionGroup.product_option_group_id, option_group_name: optionGroup.option_group_name }));
    };
    const searchOption = async (query, productId, variantId, optionGroupId) => {
        const response = await ProductOptionService.searchOption(query, productId, variantId, optionGroupId);
        return response.map(option => ({ product_option_id: option.product_option_id, product_option_name: option.option_name }));
    };

    const uploadItemOptionImages = async (files, property, itemOptionId) => {
        fb.value.clearError('media.files.upload.'+property);
        fb.value.removeSuccess('media.files.upload.'+property);
        fb.value.startLoading('media.files.upload.'+property);
        try {
            const response = await ItemOptionService.uploadItemOptionImages(files, property, itemOptionId);
            itemOption.value.image = response.files.map((item) => {
                const file = typeof item?.file === 'string' ? JSON.parse(item.file) : item;
                const imageObject = new FileModel(file);
                if (file?.objectURL) {
                    imageObject.objectURL = mediaUrl(file.objectURL);
                }
                return imageObject;
            });
            fb.value.showSuccess('Files uploaded successfully', 'media.files.upload.'+property);
            return response;
        } catch (err) {
            fb.value.setError(err, 'media.files.upload.'+property);
            throw err;
        } finally {
            fb.value.finishLoading('media.files.upload.'+property);
        }
    };

    const deleteItemOptionImages = async (file, itemOptionId) => {
        fb.value.clearError('media.files.delete.'+itemOptionId);
        fb.value.removeSuccess('media.files.delete.'+itemOptionId);
        fb.value.startLoading('media.files.delete.'+itemOptionId);
        try {
            const response = await ItemOptionService.deleteItemOptionImages(file, itemOptionId);
            itemOption.value.image = [];
            fb.value.showSuccess('media.files.delete.'+itemOptionId);
            return response;
        } catch (err) {
            fb.value.setError(err, 'media.files.delete.'+itemOptionId);
            throw err;
        } finally {
            fb.value.finishLoading('media.files.delete.'+itemOptionId);
        }
    };

    return {
        itemOptions,
        itemOption,
        // filter,
        fb,
        model,
        importExport,
        items,
        products,
        productVariants,
        productOptionGroups,
        productOptions,
        types,
        resetItemOption,
        fetchItemOptions,
        fetchItemOptionById,
        createItemOption,
        updateItemOption,
        deleteItemOption,
        importItemOptions,
        fetchItems,
        fetchProducts,
        fetchProductVariants,
        fetchProductOptionGroups,
        fetchProductOptions,
        fetchTypes,
        searchProducts,
        searchItems,
        searchProductVariants,
        searchOptionGroups,
        searchOption,
        uploadItemOptionImages,
        deleteItemOptionImages
    };
}); 