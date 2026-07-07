import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import ProductDiscountService from '@/service/ProductDiscountService';
import ProductDiscountFilter from '@/filters/ProductDiscountFilter';
import ProductDiscount from '@/models/ProductDiscount';
import FeedbackHandler from '../utils/FeedbackHandler';
import ProductDiscountImportResponse from '@/models/ProductDiscountImport';
import UserGroupService from '@/service/UserGroupService';
import UserGroup from '@/models/UserGroup';
import Product from '@/models/Product';
import ProductService from '@/service/ProductService';

export const useProductDiscountStore = defineStore('productDiscount', () => {
    /**
     * @type {import('vue').Ref<ProductDiscount[]>}
     */
    const importExport = ref(new ProductDiscountImportResponse());
    const productDiscounts = ref([]);
    const productDiscount = ref(new ProductDiscount());
    const filter = ref(new ProductDiscountFilter());
    const fb = ref(new FeedbackHandler());
    const model = 'productDiscount';
    /**
     * @type {import('vue').Ref<UserGroup[]>}
     */
    const userGroups = ref([]);
    /**
     * @type {import('vue').Ref<Product[]>}
     */
    const products = ref([]);

    const fetchUserGroups = async () => {
        const response = await UserGroupService.getUserGroups();
       let localUserGroups = response.map(userGroup => ({ label: userGroup.userGroupContent.name, value: userGroup.user_group_id }));
       userGroups.value = localUserGroups;
    };

    const fetchProducts = async () => {
        const response = await ProductService.getProducts();
        let localProducts = response.map(product => ({ label: product.product_code, value: product.product_id }));
        products.value = localProducts;
    };

    const resetProductDiscount = () => {
        productDiscount.value = new ProductDiscount();
    };

    const fetchProductDiscounts = async () => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ProductDiscountService.getProductDiscounts();
            productDiscounts.value = response.map(productDiscount => new ProductDiscount(productDiscount));
            fb.value.showSuccess(model);
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const fetchProductDiscountById = async (productDiscountId) => {
        fb.value.clearError(model + '.edit.'+productDiscountId);
        fb.value.removeSuccess(model + '.edit.'+productDiscountId);
        fb.value.startLoading(model + '.edit.'+productDiscountId);
        try {
            const lt = await ProductDiscountService.getProductDiscountById(productDiscountId);
            productDiscount.value = new ProductDiscount(lt);
            fb.value.showSuccess(model + '.edit.'+productDiscountId);
            return productDiscount.value;
        } catch (err) {
            fb.value.setError(err, model + '.edit.'+productDiscountId);
        } finally {
            fb.value.finishLoading(model + '.edit.'+productDiscountId);
        }
    };

    const createProductDiscount = async (newProductDiscount) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdProductDiscount = await ProductDiscountService.createProductDiscount(newProductDiscount);
            const productDiscountObj = new ProductDiscount(createdProductDiscount);
            productDiscount.value = productDiscountObj;
            fb.value.showSuccess(model);
            return productDiscount.value;
            // productDiscount.value.push(createdProductDiscount);
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateProductDiscount = async (updatedProductDiscount) => {
        fb.value.clearError(model + '.update.'+updatedProductDiscount.product_discount_id);
        fb.value.removeSuccess(model + '.update.'+updatedProductDiscount.product_discount_id);
        fb.value.startLoading(model + '.update.'+updatedProductDiscount.product_discount_id);
        try {
            const lt = await ProductDiscountService.updateProductDiscount(updatedProductDiscount);
            const productDiscountObj = new ProductDiscount(lt);
            const index = productDiscounts.value.findIndex(l => l.product_discount_id === updatedProductDiscount.product_discount_id);
            if (index !== -1) {
                productDiscounts.value[index] = productDiscountObj;
            }
              productDiscount.value = productDiscountObj;
            fb.value.showSuccess(model + '.update.'+updatedProductDiscount.product_discount_id);
            return productDiscount.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.'+updatedProductDiscount.product_discount_id);

        } finally {
            fb.value.finishLoading(model + '.update.'+updatedProductDiscount.product_discount_id);
        }
    };

    const deleteProductDiscount = async (productDiscountId) => {
        fb.value.clearError(model + '.delete.'+productDiscountId);
        fb.value.removeSuccess(model + '.delete.'+productDiscountId);
        fb.value.startLoading(model + '.delete.'+productDiscountId);
        try {
            await ProductDiscountService.deleteProductDiscount(productDiscountId);
            productDiscounts.value = productDiscounts.value.filter(l => l.product_discount_id !== productDiscountId);
            fb.value.showSuccess(model + '.delete.'+productDiscountId);

            // const index = productDiscounts.value = productDiscounts.value.filter(l => l.product_discount_id !== productDiscountId);
            // if (index !== -1) {
            //     productDiscounts.value[index] = productDiscountObj;
            // }
            // productDiscount.value =productDiscountObj;
            // fb.value.showSuccess('Length Type deleted successfully');
            // return productDiscounts.value;
        } catch (err) {
            fb.value.setError(err, model + '.delete.'+productDiscountId);
        } finally {
            fb.value.finishLoading(model + '.delete.'+productDiscountId);
        }
    };

    const importProductDiscounts = async (newImport) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await ProductDiscountService.importProductDiscounts(newImport);
            importExport.value = new ProductDiscountImportResponse(response);
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

    return { 
        productDiscounts, 
        productDiscount,
        filter,
        fb,
        importExport,
        resetProductDiscount,
        fetchProductDiscounts, 
        fetchProductDiscountById, 
        createProductDiscount, 
        updateProductDiscount, 
        deleteProductDiscount,
        importProductDiscounts,
        fetchUserGroups,
        fetchProducts,
        userGroups,
        products,
    };
}); 