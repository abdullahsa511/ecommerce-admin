import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import ShowroomService from '../service/ShowroomService';
import { Showroom } from '../models/Showroom.ts';
import FeedbackHandler from '../utils/FeedbackHandler';
import { FileModel } from '@/models/Media';

export const useShowroomStore = defineStore('showroom', () => {

    //State Start Here
    const server = import.meta.env.VITE_API_BASE_URL; 
    const webServer = import.meta.env.VITE_STATIC_BASE_URL;
    /**
     * @type {import('vue').Ref<Showroom[]>}
     */
    const showrooms = ref([]);
     /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
     const fb = ref(new FeedbackHandler());
     const model = 'showroom';
     const showroomStatuses = ref([]);
     const showroom = ref(new Showroom());
     //State finish here


     //Actions Start here
    const fetchShowrooms = async () => {
        // console.log('pinia statement action');
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ShowroomService.getShowrooms();
            console.log('pinia action : ', response);
            showrooms.value = response?.map(s => new Showroom(s)) ?? [];
            fb.value.showSuccess(model);
        } catch (err) {
            console.log(err);
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const fetchShowroomById = async (showroomId) => {
        fb.value.clearError(model+'.show');
        fb.value.removeSuccess(model+'.show');
        fb.value.startLoading(model+'.show');
        try {
            const data = await ShowroomService.getShowroomById(showroomId);
            fb.value.showSuccess(model+'.show');
            showroom.value = new Showroom(data);
            return showroom.value;
        } catch (err) {
            console.log(err);
            fb.value.setError(err, model+'.show');
        } finally {
            fb.value.finishLoading(model+'.show');
        }
    };

    const createShowroom = async (newShowroom) => {
        fb.value.clearError(model+'.create');
        fb.value.removeSuccess(model+'.create');
        fb.value.startLoading(model+'.create');
        try {
            const createdShowroom = await ShowroomService.createShowroom(newShowroom);
            let showroom = new Showroom(createdShowroom);
            showrooms.value.push(showroom);
            fb.value.showSuccess(model+'.create');
            return showroom;
        } catch (err) {
            fb.value.setError(err, model+'.create');
        } finally {
            fb.value.finishLoading(model+'.create');
        }
    };

    const updateShowroom = async (updatedShowroom) => {
        fb.value.clearError(model+'.update');
        fb.value.removeSuccess(model+'.update');
        fb.value.startLoading(model+'.update');
        try {
            const showroom = await ShowroomService.updateShowroom(updatedShowroom);
            fb.value.showSuccess(model+'.update');
            return new Showroom(showroom);
        } catch (err) {
            fb.value.setError(err, model+'.update');
        } finally {
            fb.value.finishLoading(model+'.update');
        }
    };

    const deleteShowroom = async (showroomId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            await ShowroomService.deleteShowroom(showroomId);
            showrooms.value = showrooms.value.filter(p => p.showroom_id !== showroomId);
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const getShowroomStatuses = async () => {
        fb.value.clearError(model+"-statuses");
        fb.value.removeSuccess(model+"-statuses");
        fb.value.startLoading(model+"-statuses");
        try {
            const response = await ShowroomService.getShowroomStatuses();
            showroomStatuses.value = response;
            fb.value.showSuccess(model+"-statuses");
            return response;
        } catch (err) {
            fb.value.setError(err, model+"-statuses");
            return [];
        } finally {
            fb.value.finishLoading(model+"-statuses");
        }
    };
    const uploadFiles = async (files, property, showroomId) => {
        for(let file of files) {
            fb.value.clearError('media.files.upload'+file.id);
            fb.value.removeSuccess('media.files.upload'+file.id);
            fb.value.startLoading('media.files.upload'+file.id);
        }
        try {
            const response = await ShowroomService.uploadFiles(files, property, showroomId);
            response.files = response.files.map(file => {
                if(!file?.ObjectURL && file?.file && typeof file.file === 'string') {
                    file = JSON.parse(file.file);
                }
                // Create the image object
                const imageObject = new FileModel(file);
                
                // Make sure the image path is fully qualified
                if (file.objectURL) {
                    imageObject.objectURL = webServer + file.objectURL;
                }
                return imageObject;
            });
            
            for(let file of files) {
                fb.value.showSuccess('Files uploaded successfully', 'media.files.upload'+file.id);
            }
            if(property === 'images') {
                showroom.value.images = showroom.value.images.map((img) => {
                    let f = response.files.find((f) => f.name === img.name);
                    if(f) return f;
                    return img;
                });
            }else{
                showroom.value[property] = response.files;
            }
            return showroom.value;
        } catch (err) {
            for(let file of files) {
                fb.value.setError(err, 'media.files.upload'+file.id);
            }
            throw err;
        } finally {
            for(let file of files) {
                fb.value.finishLoading('media.files.upload'+file.id);
            }
        }
    };
    const deleteShowroomImage = async (imageId) => {
        fb.value.clearError(model+'.delete-image');
        fb.value.removeSuccess(model+'.delete-image');
        fb.value.startLoading(model+'.delete-image');
        try {
            await ShowroomService.deleteShowroomImage(imageId);
            showroom.value.images = showroom.value.images.filter(img => img.showroom_image_id !== imageId);
            fb.value.showSuccess(model+'.delete-image');
        } catch (err) {
            fb.value.setError(err, model+'.delete-image');
        } finally {
            fb.value.finishLoading(model+'.delete-image');
        }
    };
    const deleteShowroomImageByProperty = async (showroomId, property) => {
        fb.value.clearError(model+'.delete-showroom-image');
        fb.value.removeSuccess(model+'.delete-showroom-image');
        fb.value.startLoading(model+'.delete-showroom-image');
        try {
            await ShowroomService.deleteShowroomImageByProperty(showroomId, property);
            showroom.value[property] = [];
            fb.value.showSuccess(model+'.delete-showroom-image');
        } catch (err) {
            fb.value.setError(err, model+'.delete-showroom-image');
        } finally {
            fb.value.finishLoading(model+'.delete-showroom-image');
        }
    };

    const createShowroomImport = async (newImport) => {
        fb.value.clearError(model+'.import');
        fb.value.removeSuccess(model+'.import');
        fb.value.startLoading(model+'.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }

            const response = await ShowroomtService.createShowroomImport(newImport);
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

    const createShowroomImageImport = async (newImport) => {
        fb.value.clearError(model+'.image-import');
        fb.value.removeSuccess(model+'.image-import');
        fb.value.startLoading(model+'.image-import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }

            const response = await ShowroomService.createShowroomImageImport(newImport);
            fb.value.showSuccess(model+'.image-import');
            return response;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model+'.image-import');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.image-import');
        }
    };
    //Action Finish here


    //Getters start here
    const showroomNames = computed(() => {
        return showrooms.value.map(showroom => showroom.name);
    });
    //Getters End here

    return { 
        showrooms, 
        showroom,
        fb, 
        model, 
        showroomNames, 
        showroomStatuses,
        fetchShowrooms, 
        fetchShowroomById, 
        createShowroom, 
        updateShowroom, 
        deleteShowroom, 
        createShowroomImport,
        createShowroomImageImport,
        getShowroomStatuses,
        uploadFiles,
        deleteShowroomImage,
        deleteShowroomImageByProperty
    };
}); 