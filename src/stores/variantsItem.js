import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import VariantsItemService from '@/service/VariantsItemService';
import VariantsItemFilter from '@/filters/VariantsItemFilter';
// import VariantsItem from '@/models/VariantsItem';
import FeedbackHandler from '../utils/FeedbackHandler';
import VariantItemImportResponse from '@/models/VariantItemImport';
import { VariantItem } from '@/models/Item.ts';
import ItemService from '@/service/ItemService';
import ItemOptionService from '@/service/ItemOptionService';
import ListService from '@/service/ListService';
import ProductService from '@/service/ProductService';

export const useVariantsItemStore = defineStore('variantItem', () => {
    /**
     * @type {import('vue').Ref<VariantItem[]>}
     */
    const importExport = ref(new VariantItemImportResponse());
    const variantItems = ref([]);
    const variantItem = ref(new VariantItem());
    const filter = ref(new VariantsItemFilter());
    const fb = ref(new FeedbackHandler());
    const model = 'variantItem';
    const itemVariant = ref(new VariantItem());


    const resetVariantsItem = () => {
        variantItem.value = new VariantItem();
    };

    const fetchVariantsItems = async () => {
        fb.value.clearError(model+'.list');
        fb.value.removeSuccess(model+'.list');
        fb.value.startLoading(model+'.list');
        try {
            const response = await VariantsItemService.getVariantsItems();
            variantItems.value = response.map(variantItem => new VariantItem(variantItem));
            fb.value.showSuccess(model+'.list');
        } catch (err) {
            fb.value.setError(err, model+'.list');
        } finally {
            fb.value.finishLoading(model+'.list');
        }
    };

    const fetchVariantsItemById = async (variantsItemId) => {

        fb.value.clearError(model+'.variant-items');
        fb.value.removeSuccess(model+'.variant-items');
        fb.value.startLoading(model+'.variant-items');
        try {
            const response = await VariantsItemService.getVariantsItemById(variantsItemId);
            if(response.length > 0){
                itemVariant.value = response.map(variant => new VariantItem(variant));
                itemVariant.value = itemVariant.value[0];
                itemVariant.value.selected = 1;
            }
            // console.log('variantsItem variant on store', itemVariant.value);
            fb.value.showSuccess(model+'.variant-items');
            return itemVariant.value;
        }
        catch (err) {
            fb.value.setError(err, model+'.variant-items');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.variant-items');
        }
    };

    const createVariantsItem = async (newVariantsItem) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdVariantsItem = await VariantsItemService.createVariantsItem(newVariantsItem);
            const variantsItemObj = new VariantItem(createdVariantsItem);
            variantItem.value = variantsItemObj;
            fb.value.showSuccess(model);
            return variantItem.value;
            // variantItem.value.push(createdVariantsItem);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const updateVariantsItem = async (updatedVariantsItem) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const lt = await VariantsItemService.updateVariantsItem(updatedVariantsItem);
            const variantsItemObj = new VariantItem(lt);
            const index = variantItems.value.findIndex(l => l.length_type_id === updatedVariantsItem.length_type_id);
            if (index !== -1) {
                variantItems.value[index] = variantsItemObj;
            }
              variantItem.value = variantsItemObj;
            fb.value.showSuccess('Variants item updated successfully');
            return variantItem.value;
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const deleteVariantItem = async (variantsItemId) => {
        fb.value.clearError(model+'.delete.'+variantsItemId);
        fb.value.removeSuccess(model+'.delete.'+variantsItemId);
        fb.value.startLoading(model+'.delete.'+variantsItemId);
        try {
            await VariantsItemService.deleteVariantsItem(variantsItemId);
            variantItems.value = variantItems.value.filter(l => l.variant_item_id !== variantsItemId);
            fb.value.showSuccess(model+'.delete.'+variantsItemId);
            return variantsItemId;
        } catch (err) {
            fb.value.setError(err, model+'.delete.'+variantsItemId);
        } finally {
            fb.value.finishLoading(model+'.delete.'+variantsItemId);
        }
    };

    const importVariantsItems = async (newImport) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await VariantsItemService.importVariantsItems(newImport);
            importExport.value = new VariantItemImportResponse(response);
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

    // variant 
    const getItemVariantByItemId = async (itemId) => {
        fb.value.clearError(model+'.variant-items');
        fb.value.removeSuccess(model+'.variant-items');
        fb.value.startLoading(model+'.variant-items');
        try {
            const response = await ItemService.getItemVariantByItemId(itemId);
            if(response.length > 0){
                itemVariant.value = response.map(variant => new VariantItem(variant));
                itemVariant.value = itemVariant.value[0];
                itemVariant.value.selected = 1;
            }
            console.log('productVariants on store', itemVariant.value);
            fb.value.showSuccess(model+'.variant-items');
            return itemVariant.value;
        }
        catch (err) {
            fb.value.setError(err, model+'.variant-items');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.variant-items');
        }
    };
    const listItemOptions = async (query, productId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ItemService.listItemOptions(query, productId);
            return response.productOptions;
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };
    // get item variant option by product id and item id
    const getItemVariantOptionByItemId = async (itemId) => {
        fb.value.clearError(model+'.variants-options');
        fb.value.removeSuccess(model+'.variants-options');
        fb.value.startLoading(model+'.variants-options');
        try {
            const response = await ItemService.getItemVariantOptionByItemId(itemId);
            productVariants.value = response.map(variant => new ProductVariant(variant));
            // console.log('productVariants on store', productVariants.value);
            fb.value.showSuccess(model+'.variants-options');
            return productVariants.value;
        }
        catch (err) {
            fb.value.setError(err, model+'.variants-options');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.variants-options');
        }
    }
    // end get item variant option by product id and item id
    const createItemVariant = async (data) => {
        fb.value.clearError(model + '.variant.create');
        fb.value.removeSuccess(model + '.variant.create');
        fb.value.startLoading(model + '.variant.create');
        try {
            const variants = await VariantsItemService.createItemVariant(data);
            // Reset selection flags without replacing the array
            if(Array.isArray(variants) && variants.length > 0){
                itemVariant.value = new VariantItem(variants[0]);
            }else if(typeof variants === 'object'){
                itemVariant.value = new VariantItem(variants);
            }
            fb.value.showSuccess(model + '.variant.create');
            return itemVariant.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.variant.create');
        } finally {
            fb.value.finishLoading(model + '.variant.create');
        }
    };
    // update item variant
    const updateItemVariant = async (data) => {
        console.log('data on updateItemVariant', data.product_variant_id);
        fb.value.clearError(model + '.variant.update.' + data.product_variant_id);
        fb.value.removeSuccess(model + '.variant.update.' + data.product_variant_id);
        fb.value.startLoading(model + '.variant.update.' + data.product_variant_id);

        // const uniqueGroup = data.product_id + '-' + data.product_variant_id + '-' + data.option_group_name + '_group_error';
        // const uniqueOption = data.product_id + '-' + data.product_variant_id + '-' + data.product_option_group_id + '-' + data.option_name + '_option_error';

        // console.log('uniqueGroup', uniqueGroup);
        // console.log('uniqueOption', uniqueOption);

        try {
            const response = await VariantsItemService.updateItemVariant(data);
            if(Array.isArray(response) && response.length > 0){
                itemVariant.value = new VariantItem(response[0]);
            }else if(typeof response === 'object'){
                itemVariant.value = new VariantItem(response);
            }
            fb.value.showSuccess(model + '.variant.update.' + data.product_variant_id);
            return itemVariant.value;

        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            // fb.value.setError(error, '1-100-Worktop Dimensions_group_error');
            Object.entries(error).forEach(([key, messages]) => {
                fb.value.setError(messages, key);
            });
        } finally {
            fb.value.finishLoading(model + '.variant.update.' + data.product_variant_id);
        }
    };
    // end update item variant

    const deleteItemOption = async (itemOptionId, groupIndex) => { // send
        fb.value.clearError(model + '.option.delete.' + itemOptionId);
        fb.value.removeSuccess(model + '.option.delete.' + itemOptionId);
        fb.value.startLoading(model + '.option.delete.' + itemOptionId);
        try {
            const response = await ItemOptionService.deleteItemOption(itemOptionId);
            itemVariant.value.itemOptionGroups[groupIndex].itemOptions = itemVariant.value.itemOptionGroups[groupIndex].itemOptions
                                                                                .filter(o => o.item_option_id !== itemOptionId);
            fb.value.showSuccess(model + '.option.delete.' + itemOptionId);
            return response.data;
        } catch (err) {
            fb.value.setError(err, model + '.option.delete.' + itemOptionId);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.option.delete.' + itemOptionId);
        }
    };

    const deleteItemOptionGroup = async (group) => { // send
        console.log('group on deleteItemOption', group);
        fb.value.clearError(model + '.option-group.delete.'+group.product_option_group_id);
        fb.value.removeSuccess(model + '.option-group.delete.'+group.product_option_group_id);
        fb.value.startLoading(model + '.option-group.delete.'+group.product_option_group_id);
        try {
            await ItemOptionService.deleteItemOptionGroup(group);
            productOptionGroups.value = productOptionGroups.value.filter(p => p.product_option_group_id !== group.product_option_group_id);
            fb.value.showSuccess(model + '.option-group.delete.'+group.product_option_group_id);
            return group.product_option_group_id;
        } catch (err) {
            fb.value.setError(err, model + '.option-group.delete.'+group.product_option_group_id);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.option-group.delete.'+group.product_option_group_id);
        }
    };

    const deleteItemVariant = async (productVariantId) => {
        fb.value.clearError(model + '.variant.delete.' + productVariantId);
        fb.value.removeSuccess(model + '.variant.delete.' + productVariantId);
        fb.value.startLoading(model + '.variant.delete.' + productVariantId);
        try {
            const response = await ItemService.deleteItemVariant(productVariantId);
            productVariants.value = productVariants.value.filter(variant => variant.product_variant_id !== productVariantId);
            return response.data;
        } catch (err) {
            fb.value.setError(err, model + '.variant.delete.' + productVariantId);
        } finally {
            fb.value.finishLoading(model + '.variant.delete.' + productVariantId);
        }
    };

    const listItemVariants = async (query, productId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ItemService.listItemVariants(query, productId);
            console.log('response listItemVariants', response);
            return response;
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const listItemOptionGroups = async (query, productId) => {

        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ItemService.listItemOptionGroups(query, productId);
            console.log('response group', response);
            return response;
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const listProductOptions = async (query, productId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ProductService.listVariantGroupOptions(query, productId);
            return response.productOptions;
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const listTypes = async (query) => {
        fb.value.clearError(model+'.list.types');
        fb.value.removeSuccess(model+'.list.type');
        fb.value.startLoading(model+'.list.type');
        try {
            const response = await ListService.getList('types');
            return response;
        }
        catch (err) {
            fb.value.setError(err, model+'.list.type');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.list.type');
        }
    }

    const listItems = async (query, productId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ItemService.listItems(query, productId);
            console.log('response listItemVariants', response);
            return response;
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const searchProducts = async (query) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ProductService.searchProducts(query);
            fb.value.showSuccess(model);
            return response;
        } catch (err) {
            fb.value.setError(err, model);
            return [];
        } finally {
            fb.value.finishLoading(model);
        }
    };

    return { 
        variantItems, 
        variantItem,
        itemVariant,
        filter,
        fb,
        importExport,
        resetVariantsItem,
        fetchVariantsItems, 
        fetchVariantsItemById, 
        createVariantsItem, 
        updateVariantsItem, 
        deleteVariantItem,
        importVariantsItems,
        createItemVariant,
        getItemVariantByItemId,
        listItemOptions,
        getItemVariantOptionByItemId,
        updateItemVariant,
        deleteItemOption,
        deleteItemOptionGroup,
        deleteItemVariant,
        listItemVariants,
        listItemOptionGroups,
        listProductOptions,
        listTypes,
        listItems,
        searchProducts
    };
}); 