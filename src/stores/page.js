import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import PageService from '../service/PageService';
import { Page } from '../models/Page.ts';
import FeedbackHandler from '../utils/FeedbackHandler';
import { FileModel } from '@/models/Media.ts';

export const usePageStore = defineStore('page', () => {
    /**
     * @type {import('vue').Ref<Page[]>}
     */
    const pages = ref([]);
     /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
     const fb = ref(new FeedbackHandler());
     const model = 'page';
     const pageStatuses = ref([]);

     const fetchPages = async () => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await PageService.getPages();
            pages.value = response.map(page => new Page(page)) ?? [];
            fb.value.showSuccess(model);
        } catch (err) {
            console.log(err);
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const pageNames = computed(() => {
        return pages.value.map(page => page.name);
    });

    const fetchPageById = async (pageId) => {
        fb.value.clearError(model+'.edit.'+pageId);
        fb.value.removeSuccess(model+'.edit.'+pageId);
        fb.value.startLoading(model+'.edit.'+pageId);
        try {
            const page = await PageService.getPageById(pageId);
            fb.value.showSuccess(model+'.edit.'+pageId);
            return new Page(page);
        } catch (err) {
            fb.value.setError(err, model+'.edit.'+pageId);
        } finally {
            fb.value.finishLoading(model+'.edit.'+pageId);
        }
    };

    const createPage = async (newPage) => {
        fb.value.clearError(model+'.create');
        fb.value.removeSuccess(model+'.create');
        fb.value.startLoading(model+'.create');
        return new Promise(async(resolve, reject) => {
            try {
                const createdPage = await PageService.createPage(newPage);
                let page = new Page(createdPage);
                pages.value.push(page);
                fb.value.showSuccess(model+'.create');
                resolve(page);
            } catch (err) {
                fb.value.setError(err, model+'.create');
                reject(err);
            } finally {
                fb.value.finishLoading(model+'.create');
            }
        })
        
    };

    const createPage_old = async (newPage) => {
        fb.value.clearError(model+'.create');
        fb.value.removeSuccess(model+'.create');
        fb.value.startLoading(model+'.create');
        try {
            const createdPage = await PageService.createPage(newPage);
            let page = new Page(createdPage);
            pages.value.push(page);
            fb.value.showSuccess(model+'.create');
            return page;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model+'.create');
            // throw error;
        } finally {
            fb.value.finishLoading(model+'.create');
        }
    };

    const updatePage = async (updatedPage) => {
        fb.value.clearError(model+'.update.'+updatedPage.post_id);
        fb.value.removeSuccess(model+'.update.'+updatedPage.post_id);
        fb.value.startLoading(model+'.update.'+updatedPage.post_id);
        try {
            const page = await PageService.updatePage(updatedPage);
            fb.value.showSuccess(model+'.update.'+updatedPage.post_id);
            return new Page(page);
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model+'.update.'+updatedPage.post_id);
        } finally {
            fb.value.finishLoading(model+'.update.'+updatedPage.post_id);
        }
    };

    const deletePage = async (pageId) => {
        fb.value.clearError(model+'.delete.'+pageId);
        fb.value.removeSuccess(model+'.delete.'+pageId);
        fb.value.startLoading(model+'.delete.'+pageId);
        try {
            await PageService.deletePage(pageId);
            pages.value = pages.value.filter(p => p.post_id !== pageId);
            fb.value.showSuccess(model+'.delete.'+pageId);
        } catch (err) {
            fb.value.setError(err, model+'.delete.'+pageId);
        } finally {
            fb.value.finishLoading(model+'.delete.'+pageId);
        }
    };

    const getPageStatuses = async () => {
        fb.value.clearError(model+"-statuses");
        fb.value.removeSuccess(model+"-statuses");
        fb.value.startLoading(model+"-statuses");
        try {
            const response = await PageService.getPageStatuses();
            pageStatuses.value = response;
            fb.value.showSuccess(model+"-statuses");
            return response;
        } catch (err) {
            fb.value.setError(err, model+"-statuses");
            return [];
        } finally {
            fb.value.finishLoading(model+"-statuses");
        }
    };

    // uploadFiles
    const uploadFiles = async (files, property, pageId) => {
        fb.value.clearError(model+'.files.upload.'+property);
        fb.value.removeSuccess(model+'.files.upload.'+property);
        fb.value.startLoading(model+'.files.upload.'+property);
        try {
            const response = await PageService.uploadFiles(files, property, pageId);
            pages.value[property] = response.files.map(item => new FileModel(item));
            
            fb.value.showSuccess('Files uploaded successfully', model+'.files.upload.'+property);
            return response;
        } catch (err) {
            fb.value.setError(err, model+'.files.upload.'+property);
            throw err;
        } finally {
            fb.value.finishLoading(model+'.files.upload.'+property);
        }
    };

     const deleteImageByFilePath = async (filepath, property, pageId) => {
        fb.value.clearError(model+'.files.delete.'+property);
        fb.value.removeSuccess(model+'.files.delete.'+property);
        fb.value.startLoading(model+'.files.delete.'+property);
        try {
            const response = await PageService.deleteFileByPath(filepath, property, pageId);
            fb.value.showSuccess('Image deleted successfully', model+'.files.delete.'+property);
            return response;
        } catch (err) {
            fb.value.setError(err, model+'.files.delete.'+property);
            throw err;
        } finally {
            fb.value.finishLoading(model+'.files.delete.'+property);
        }
    };

    return { 
        pages, 
        fb, 
        model, 
        pageNames, 
        pageStatuses,
        fetchPages, 
        fetchPageById, 
        createPage, 
        updatePage, 
        deletePage, 
        getPageStatuses ,
        uploadFiles,
        deleteImageByFilePath,
    };
}); 