import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import PostTypeService from '../service/PostTypeService';
// import PostTypeFilter from '../filters/PostTypeFilter';
import PostType from '../models/PostType';
import FeedbackHandler from '../utils/FeedbackHandler';
import PostTypeImportResponse from '../models/PostTypeImport';
import { FileModel } from '@/models/Media';
import PostTypeFilter from '@/filters/PostTypeFilter';

export const usePostTypeStore = defineStore('postType', () => {
    /**
     * @type {import('vue').Ref<PostType[]>}
     */
    const postTypes = ref([]);
    const postType = ref(new PostType());
    const filter = ref(new PostTypeFilter());
    
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'postType';
    const importExport = ref(new PostTypeImportResponse());

    const resetPostType = () => {
        postType.value = new PostType();
    };

    const fetchPostTypes = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await PostTypeService.getPostTypes();
            postTypes.value = response.map(postType => new PostType(postType));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const fetchPostTypeById = async (postTypeId) => {
        fb.value.clearError(model + '.edit.' + postTypeId);
        fb.value.removeSuccess(model + '.edit.' + postTypeId);
        fb.value.startLoading(model + '.edit.' + postTypeId);
        try {
            const postTypeData = await PostTypeService.getPostTypeById(postTypeId);
            const postTypeObj = new PostType(postTypeData);
            postType.value = postTypeObj;
            fb.value.showSuccess(model + '.edit.' + postTypeId);
            return postType.value;
        } catch (err) {
            fb.value.setError(err, model + '.edit.' + postTypeId);
        } finally {
            fb.value.finishLoading(model + '.edit.' + postTypeId);
        }
    };

    const createPostType = async (postType) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdPostType = await PostTypeService.createPostType(postType);
            postType.value = new PostType(createdPostType);
            fb.value.showSuccess(model + '.create');
            return postType.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updatePostType = async (postTypeId, updatedPostType) => {
        fb.value.clearError(model + '.update.' + postTypeId);
        fb.value.removeSuccess(model + '.update.' + postTypeId);
        fb.value.startLoading(model + '.update.' + postTypeId);
        try {
            const postType = await PostTypeService.updatePostType(postTypeId, updatedPostType);
            const index = postTypes.value.findIndex(p => p.post_type_id === postTypeId);
            if (index !== -1) {
                postTypes.value[index] = postType;
            }
            fb.value.showSuccess(model + '.update.' + postTypeId);
            return postType;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + postTypeId);
        } finally {
            fb.value.finishLoading(model + '.update.' + postTypeId);
        }
    };

    const deletePostType = async (postTypeId) => {
        fb.value.clearError(model + '.delete.' + postTypeId);
        fb.value.removeSuccess(model + '.delete.' + postTypeId);
        fb.value.startLoading(model + '.delete.' + postTypeId);
        try {
            await PostTypeService.deletePostType(postTypeId);
            postTypes.value = postTypes.value.filter(p => p.post_type_id !== postTypeId);
            fb.value.showSuccess(model + '.delete.' + postTypeId);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + postTypeId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + postTypeId);
        }
    };

    // import taxonomies csv
    const postTypeImport = async (formData) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!formData) {
                throw new Error('No file data provided to import taxonomies');
            }
            const response = await PostTypeService.postTypeImport(formData);
            console.log('Store received response:', response);
            importExport.value = new PostTypeImportResponse(response);
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

    const uploadPostTypeImages = async (files, property, postTypeId) => {
        fb.value.clearError('media.files.upload.'+property);
        fb.value.removeSuccess('media.files.upload.'+property);
        fb.value.startLoading('media.files.upload.'+property);
        try {
            const response = await PostTypeService.uploadPostTypeImages(files, property, postTypeId);
            postType.value.image = response.files.map(item => new FileModel(item));
            fb.value.showSuccess('Files uploaded successfully', 'media.files.upload.'+property);
            return response;
        } catch (err) {
            fb.value.setError(err, 'media.files.upload.'+property);
            throw err;
        } finally {
            fb.value.finishLoading('media.files.upload.'+property);
        }
    };

    const deletePostTypeImages = async (file, postTypeId) => {
        fb.value.clearError('media.files.delete.'+postTypeId);
        fb.value.removeSuccess('media.files.delete.'+postTypeId);
        fb.value.startLoading('media.files.delete.'+postTypeId);
        try {
            const response = await PostTypeService.deletePostTypeImages(file, postTypeId);
            postType.value.image = [];
            fb.value.showSuccess('media.files.delete.'+postTypeId);
            return response;
        } catch (err) {
            fb.value.setError(err, 'media.files.delete.'+postTypeId);
            throw err;
        } finally {
            fb.value.finishLoading('media.files.delete.'+postTypeId);
        }
    };

    // import post types csv
    return { 
        postTypes, 
        postType,
        importExport,
        filter,
        fb,
        resetPostType,
        fetchPostTypes, 
        fetchPostTypeById, 
        createPostType, 
        updatePostType, 
        deletePostType,
        postTypeImport,
        uploadPostTypeImages,
        deletePostTypeImages
    };
}); 