import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import CategoryService from '../service/CategoryService';
import FeedbackHandler from '../utils/FeedbackHandler';
import { WayPoint } from '@/models/WayPoint';
import { FileModel } from '@/models/Media';

export const useCategoryStore = defineStore('category', () => {
    /**
     * @type {import('vue').Ref<any[]>}
     */
    const categories = ref([]);
     /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
     const fb = ref(new FeedbackHandler());
     const model = 'category';
     const category = ref({});

     const fetchCategories = async () => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await CategoryService.getCategories();
            categories.value = response.list ?? [];
            fb.value.showSuccess(model);
        } catch (err) {
            console.log(err);
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const fetchProductCategories = async () => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await CategoryService.getProductCategories();
            categories.value = response ?? [];

            // console.log("categories", categories.value);
            // loop each cateregory and where banner_way_points is empty add a new way point
            categories.value.forEach(category => {
                if(!category.banner_way_points || category.banner_way_points.length <= 0) {
                    category.banner_way_points = [
                        new WayPoint({
                            id: 1,
                            leftPx: 0,
                            topPx: 0,
                            leftPercent: 2,
                            topPercent: 2,
                            linkActive: false,
                            label: "Point 1",
                        }),
                    ];
                }
            });

            fb.value.showSuccess(model);
        } catch (err) {
            console.log(err);
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const categoryNames = computed(() => {
        return categories.value.map(category => category.name);
    });

    const fetchCategoryById = async (categoryId) => {
        fb.value.clearError(model+'.show');
        fb.value.removeSuccess(model+'.show');
        fb.value.startLoading(model+'.show');
        try {
            const data = await CategoryService.getCategoryById(categoryId);
            fb.value.showSuccess(model+'.show');
            category.value = data;
            return category.value;
        } catch (err) {
            console.log(err);
            fb.value.setError(err, model+'.show');
        } finally {
            fb.value.finishLoading(model+'.show');
        }
    };

    const createCategory = async (newCategory) => {
        fb.value.clearError(model+'.create');
        fb.value.removeSuccess(model+'.create');
        fb.value.startLoading(model+'.create');
        try {
            const createdCategory = await CategoryService.createCategory(newCategory);
            categories.value.push(createdCategory);
            fb.value.showSuccess(model+'.create');
            return createdCategory;
        } catch (err) {
            fb.value.setError(err, model+'.create');
        } finally {
            fb.value.finishLoading(model+'.create');
        }
    };

    const getCategoryId = (category) => category?.category_id ?? category?.id;

    const sameCategoryId = (a, b) => String(a ?? '') === String(b ?? '');

    const patchCategoryInStore = (categoryId, apiResponse, payload) => {
        const displayName = apiResponse?.name ?? apiResponse?.label ?? apiResponse?.label_name
            ?? payload?.name ?? payload?.label ?? payload?.label_name ?? '';
        const updates = {
            ...apiResponse,
            name: displayName,
            label: apiResponse?.label ?? displayName,
            label_name: apiResponse?.label_name ?? displayName,
            slug: apiResponse?.slug ?? payload?.slug,
            description: apiResponse?.description ?? payload?.description,
            content: apiResponse?.content ?? payload?.content,
            meta_title: apiResponse?.meta_title ?? payload?.meta_title,
            meta_description: apiResponse?.meta_description ?? payload?.meta_description,
            meta_keywords: apiResponse?.meta_keywords ?? payload?.meta_keywords,
        };

        const patchList = (items) => {
            for (const item of items) {
                if (sameCategoryId(getCategoryId(item), categoryId)) {
                    Object.assign(item, updates);
                    return true;
                }
                if (item.children?.length && patchList(item.children)) {
                    return true;
                }
            }
            return false;
        };

        return patchList(categories.value);
    };

    const updateCategory = async (updatedCategory) => {
        fb.value.clearError(model+'.update');
        fb.value.removeSuccess(model+'.update');
        fb.value.startLoading(model+'.update');
        try {
            const category = await CategoryService.updateCategory(updatedCategory);
            const categoryId = getCategoryId(updatedCategory);
            if (category && categoryId != null) {
                patchCategoryInStore(categoryId, category, updatedCategory);
            }
            fb.value.showSuccess(model+'.update');
            return category;
        } catch (err) {
            fb.value.setError(err, model+'.update');
        } finally {
            fb.value.finishLoading(model+'.update');
        }
    };

    const deleteCategory = async (categoryId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            await CategoryService.deleteCategory(categoryId);
            categories.value = categories.value.filter(c => c.category_id !== categoryId);
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const createCategoryImport = async (newImport) => {
        fb.value.clearError(model+'.import');
        fb.value.removeSuccess(model+'.import');
        fb.value.startLoading(model+'.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }

            const response = await CategoryService.createCategoryImport(newImport);
            console.log('Store received response:', response);
            fb.value.showSuccess(model+'.import');
            return response;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model+'.import');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.import');
        }
    };

    const updateCategoryWayPoints = async (categoryId, wayPoints) => {
        fb.value.clearError(model+'.wayPoints.'+categoryId);
        fb.value.removeSuccess(model+'.wayPoints.'+categoryId);
        fb.value.startLoading(model+'.wayPoints.'+categoryId);
        try {
            const property = 'category';
            const response = await CategoryService.updateCategoryWayPoints(categoryId, property, wayPoints);
            let updatedWayPoints = [];
            if (Array.isArray(response)) {
                updatedWayPoints = response;
            } else if (response && Array.isArray(response.way_points)) {
                updatedWayPoints = response.way_points;
            } else {
                updatedWayPoints = wayPoints;
            }

            categories.value.banner_way_points = updatedWayPoints;
            fb.value.showSuccess(model+'.wayPoints.'+categoryId);
            return response;
        } catch (err) {
            fb.value.setError(err, model+'.wayPoints.'+categoryId);
            throw err;
        } finally {
            fb.value.finishLoading(model+'.wayPoints.'+categoryId);
        }
    };

    const getWayPointSuggestions = async (query) => {
        fb.value.clearError(model+'.way-points-suggestions.'+query);
        fb.value.removeSuccess(model+'.way-points-suggestions.'+query);
        fb.value.startLoading(model+'.way-points-suggestions.'+query);
        try {
            const response = await CategoryService.getWayPointSuggestions(query);

            return response;
        } catch (err) {
            fb.value.setError(err, model+'.way-points-suggestions.'+query);
            throw err;
        } finally {
            fb.value.finishLoading(model+'.way-points-suggestions.'+query);
        }
    };

    const updateCategoryOrder = async (categoryId, orderedCategories) => {
        fb.value.clearError(model+'.update-order.'+categoryId);
        fb.value.removeSuccess(model+'.update-order.'+categoryId);
        fb.value.startLoading(model+'.update-order.'+categoryId);
        try {
            const response = await CategoryService.updateCategoryOrder(orderedCategories);
            fb.value.showSuccess(model+'.update-order.'+categoryId);
            return response;
        } catch (err) {
            fb.value.setError(err, model+'.update-order.'+categoryId);
            throw err;
        } finally {
            fb.value.finishLoading(model+'.update-order.'+categoryId);
        }
    };


    const uploadCategoryImage = async (files, property, categoryId) => {
        fb.value.clearError('media.files.upload.'+property);
        fb.value.removeSuccess('media.files.upload.'+property);
        fb.value.startLoading('media.files.upload.'+property);
        try {
            const response = await CategoryService.uploadCategoryImage(files, property, categoryId);
            category.value[property] = response.files.map(item => new FileModel(item));
            fb.value.showSuccess('Files uploaded successfully', 'media.files.upload.'+property);
            return response.files;
        } catch (err) {
            fb.value.setError(err, 'media.files.upload.'+property);
            throw err;
        } finally {
            fb.value.finishLoading('media.files.upload.'+property);
        }
    };

    const deleteCategoryImage = async (file, property, categoryId) => {
        fb.value.clearError('media.files.delete.'+categoryId);
        fb.value.removeSuccess('media.files.delete.'+categoryId);
        fb.value.startLoading('media.files.delete.'+categoryId);
        try {
            const response = await CategoryService.deleteCategoryImage(file, property, categoryId);
            category.value[property] = [];
            fb.value.showSuccess('media.files.delete.'+categoryId);
            return response;
        } catch (err) {
            fb.value.setError(err, 'media.files.delete.'+categoryId);
            throw err;
        } finally {
            fb.value.finishLoading('media.files.delete.'+categoryId);
        }
    };

    return { 
        categories, 
        category,
        fb, 
        model, 
        categoryNames, 
        fetchCategories, 
        fetchProductCategories,
        fetchCategoryById, 
        createCategory, 
        updateCategory, 
        deleteCategory, 
        createCategoryImport,
        updateCategoryWayPoints,
        getWayPointSuggestions,
        updateCategoryOrder,
        uploadCategoryImage,
        deleteCategoryImage
    };
});