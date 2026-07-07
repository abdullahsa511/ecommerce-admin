import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import ItemService from '@/service/ItemService';
import ProductService from '@/service/ProductService';
import VariantService from '@/service/VariantService';
import ItemOptionService from '@/service/ItemOptionService';

import FeedbackHandler from '@/utils/FeedbackHandler';
import Item, { VariantItem } from '@/models/Item';
import { FileModel } from '@/models/Media';
import ItemImportResponse from '@/models/ItemImportResponse';
import Request from '@/models/Request';
import ItemFilter from '@/filters/ItemFilter';
import ListService from '@/service/ListService';
import { mediaUrl } from '@/utils/mediaUrl';

export const useItemStore = defineStore('item', () => {
    /**
     * @type {import('vue').Ref<Item[]>}
     */
    const items = ref([]);
    const products = ref([]);
    const item = ref(new Item());
    const itemVariant = ref(new VariantItem());
    const variantItems = ref([]);
    const itemOptions = ref([]);
    const resetItem = () => {
        item.value = new Item();
    };

    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'item';
    const itemsLists = ref([]);
    const importExport = ref(new ItemImportResponse());
    const dimensionImportExport = ref(new ItemImportResponse());
    const pagination = ref(new Request({page: 1, limit: 500}));
    const filters = ref({ ...new ItemFilter() });

    const fetchItems = async (query, resetItems = false) => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await ItemService.getItems(query);
            const newItems = response.items.map(item => new Item(item));
            
            // Get the current page from response
            const currentPage = response.pagination.page || 1;
            
            if (resetItems || currentPage === 1) {
                // Reset items: first page or explicit reset (e.g., when filters change)
                items.value = newItems;
            } else {
                // Subsequent pages - append new items to existing array
                // Use a Set to track item_ids we already have to avoid duplicates
                const existingItemIds = new Set(items.value.map(item => item.item_id).filter(id => id !== null));
                
                // Filter out any duplicates (shouldn't happen, but safety check)
                const uniqueNewItems = newItems.filter(item => !existingItemIds.has(item.item_id));
                
                // Append new unique items
                items.value = [...items.value, ...uniqueNewItems];
            }
            
            // Update pagination - 'first' from response represents total items loaded so far
            pagination.value = new Request(response.pagination);
            filters.value = Request.createFilterObject(filters.value, response.pagination.filters);
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const itemsNames = computed(() => {
        return items.value.map(item => item.name);
    });

    const fetchProducts = async () => {
        const response = await ProductService.getProductList();
        products.value = response.map(product => ({
            id: product.product_id,
            name: product.name
        }));
    };

    const fetchProductVariants = async () => {
        const response = await VariantService.getVariants();
        productVariants.value = response.map(variant => ({ id: variant.product_variant_id, name: variant.variant_name }));

    };

    const fetchItemById = async (itemsId) => {
        
        fb.value.clearError(model + '.edit.' + itemsId);
        fb.value.removeSuccess(model + '.edit.' + itemsId);
        fb.value.startLoading(model + '.edit.' + itemsId);
        try {
            const itemData = await ItemService.getItemById(itemsId);
            item.value = new Item(itemData);
            fb.value.showSuccess(model + '.edit.' + itemsId);
            return item.value;
        } catch (err) {
            fb.value.setError(err, model + '.edit.' + itemsId);
        } finally {
            fb.value.finishLoading(model + '.edit.' + itemsId);
        }
    };

    const createItem = async (newItem) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdItem = await ItemService.createItem(newItem);
            let item = new Item(createdItem);
            items.value.push(item);
            fb.value.showSuccess(model + '.create');
            return createdItem;
        } catch (err) {
            let error = err.response?.data?.errors;
            if (!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateItem = async (updatedItem) => {
        fb.value.clearError(model + '.update.' + updatedItem.item_id);
        fb.value.removeSuccess(model + '.update.' + updatedItem.item_id);
        fb.value.startLoading(model + '.update.' + updatedItem.item_id);
        try {
            const item = await ItemService.updateItem(updatedItem);
            fb.value.showSuccess(model + '.update.' + updatedItem.item_id);
            return new Item(item);
        } catch (err) {
            let error = err.response?.data?.errors;
            if (!error) error = err;
            fb.value.setError(error, model + '.update.' + updatedItem.item_id);
        } finally {
            fb.value.finishLoading(model + '.update.' + updatedItem.item_id);
        }
    };

    const deleteItem = async (itemsId) => {
        fb.value.clearError(model + '.delete.' + itemsId);
        fb.value.removeSuccess(model + '.delete.' + itemsId);
        fb.value.startLoading(model + '.delete.' + itemsId);
        try {
            await ItemService.deleteItem(itemsId);
            items.value = items.value.filter(p => p.item_id !== itemsId);
            fb.value.showSuccess(model + '.delete.' + itemsId);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + itemsId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + itemsId);
        }
    };

    const importItems = async (formData) => {
        fb.value.clearError(model + ".import");
        fb.value.removeSuccess(model + ".import");
        fb.value.startLoading(model + ".import");
        try {
            const response = await ItemService.importItems(formData);
            importExport.value = new ItemImportResponse(response);
        }
        catch (err) {
            fb.value.setError(err, model + ".import");
        } finally {
            fb.value.finishLoading(model + ".import");
        }
    };

    const importDimensions = async (formData) => {
        fb.value.clearError(model + ".import.dimensions");
        fb.value.removeSuccess(model + ".import.dimensions");
        fb.value.startLoading(model + ".import.dimensions");
        try {
            const response = await ItemService.importDimensions(formData);
            dimensionImportExport.value = response;
            // dimensionImportExport.value = new ItemImportResponse(response);
        }
        catch (err) {
            fb.value.setError(err, model + ".import.dimensions");
        } finally {
            fb.value.finishLoading(model + ".import.dimensions");
        }
    };

    const itemsList = async () => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ItemService.getItemList();
            itemsLists.value = response;
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const uploadItemImages = async (files, property, itemsId) => {
        fb.value.clearError('media.files.upload');
        fb.value.removeSuccess('media.files.upload');
        fb.value.startLoading('media.files.upload');
        try {
            const response = await ItemService.uploadItemImages(files, property, itemsId);
            response.files = response.files.map(file => {
                if (!file?.ObjectURL && file?.file && typeof file.file === 'string') {
                    file = JSON.parse(file.file);
                }
                // Create the image object
                const imageObject = new FileModel(file);

                // Make sure the image path is fully qualified
                if (file.objectURL) {
                    imageObject.objectURL = mediaUrl(file.objectURL);
                }
                return imageObject;
            });

            fb.value.showSuccess('Files uploaded successfully', model + '.files.upload.' + property);
            return response;
        } catch (err) {
            fb.value.setError(err, 'media.files.upload');
            throw err;
        } finally {
            fb.value.finishLoading('media.files.upload');
        }
    };

    const deleteItemImage = async (imageId) => {
        fb.value.clearError(model + '.delete-image');
        fb.value.removeSuccess(model + '.delete-image');
        fb.value.startLoading(model + '.delete-image');
        try {
            await ItemService.deleteItemImage(imageId);
            item.value.images = item.value.images.filter(img => img.items_image_id !== imageId);
            fb.value.showSuccess(model + '.delete-image');
        } catch (err) {
            fb.value.setError(err, model + '.delete-image');
        } finally {
            fb.value.finishLoading(model + '.delete-image');
        }
    };

    const deleteImageByFilePath = async (filepath, property, itemId) => {
        fb.value.clearError('media.files.delete');
        fb.value.removeSuccess('media.files.delete');
        fb.value.startLoading('media.files.delete');
        try {
            const response = await ItemService.deleteImageByFilePath(filepath, property, itemId);
            fb.value.showSuccess('Image deleted successfully');
            return response;
        } catch (err) {
            fb.value.setError(err, 'media.files.delete');
            throw err;
        } finally {
            fb.value.finishLoading('media.files.delete');
        }
    };


    // variant 
    const createItemVariant = async (data) => {
        fb.value.clearError(model + '.variant.create');
        fb.value.removeSuccess(model + '.variant.create');
        fb.value.startLoading(model + '.variant.create');
        try {
            const variants = await ItemService.createItemVariant(data);
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
            fb.value.showSuccess(model+'.variant-items');
            return itemVariant.value;
        }
        catch (err) {
            fb.value.setError(err, model+'.variant-items');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.variant-items');
        }
     }
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
     // update item variant
     const updateItemVariant = async (data) => {
        fb.value.clearError(model + '.variant.update.' + data.product_variant_id);
        fb.value.removeSuccess(model + '.variant.update.' + data.product_variant_id);
        fb.value.startLoading(model + '.variant.update.' + data.product_variant_id);

        // const uniqueGroup = data.product_id + '-' + data.product_variant_id + '-' + data.option_group_name + '_group_error';
        // const uniqueOption = data.product_id + '-' + data.product_variant_id + '-' + data.product_option_group_id + '-' + data.option_name + '_option_error';


        try {
            const response = await ItemService.updateItemVariant(data);
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
           return response.data;
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

    return {
        items,
        item,
        itemVariant,
        fb,
        itemsNames,
        itemsLists,
        importExport,
        dimensionImportExport,
        products,
        variantItems,
        itemOptions,
        pagination,
        filters,
        fetchItems,
        fetchItemById,
        createItem,
        updateItem,
        deleteItem,
        itemsList,
        uploadItemImages,
        deleteImageByFilePath,
        deleteItemImage,
        importItems,
        importDimensions,
        fetchProducts,
        fetchProductVariants,
        getItemVariantByItemId,
        listItemOptions,
        getItemVariantOptionByItemId,
        deleteItemOption,
        createItemVariant,
        deleteItemOptionGroup,
        updateItemVariant,
        deleteItemVariant,
        listItemVariants,
        listItemOptionGroups,
        listProductOptions,
        listTypes,
        resetItem
    };
}); 