import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import ComponentService from '../service/ComponentService';
import Component from '../models/Component';
import FeedbackHandler from '../utils/FeedbackHandler';
import { FileModel } from '@/models/Media';
import { WayPoint } from '@/models/WayPoint';
import { mediaUrl } from '@/utils/mediaUrl';

export const useComponentStore = defineStore('component', () => {
    /**
     * @type {import('vue').Ref<Component[]>}
     */
    const components = ref([]);
    const componentData =  ref(new Component());
    const componentItems = ref([]);
    
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'component';
    const server = import.meta.env.VITE_API_BASE_URL;

    const resetComponent = () => {
        componentData.value = new Component();
    };

    const fetchComponents = async () => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ComponentService.getComponents();
            components.value = response.map(component => new Component(component));
            fb.value.showSuccess(model);
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const fetchComponentById = async (componentId) => {
        fb.value.clearError(model+'.edit.'+componentId);
        fb.value.removeSuccess(model+'.edit.'+componentId);
        fb.value.startLoading(model+'.edit.'+componentId);
        try {
            const component = await ComponentService.getComponentById(componentId);
            componentData.value = new Component(component);
            if(componentData.value.banner_way_points.length <= 0) {
                componentData.value.banner_way_points = [
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
            // console.log('Component: ', component.value);
            componentItems.value = componentData.value.items;
            // console.log('Component Items: ', componentItems.value);
            fb.value.showSuccess(model);
            return componentData.value;
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const createComponent = async (newComponent) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const createdComponent = await ComponentService.createComponent(newComponent);
            components.value.push(createdComponent);
            fb.value.showSuccess(model);
            return createdComponent;
        } catch (err) {
            fb.value.setError(err, model);
            throw err;
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const updateComponent = async (componentId, updatedComponent) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            updatedComponent.images = updatedComponent.images.map(image => {
                delete image.file;
                return image;
            });
            const componentData = await ComponentService.updateComponent(componentId, updatedComponent);
            const updatedComponentData = new Component(componentData);
            const index = components.value.findIndex(c => c.component_id === componentId);
            if (index !== -1) {
                components.value[index] = updatedComponentData;
            }
            fb.value.showSuccess('Component updated successfully');
            componentData.value = updatedComponentData;
            componentItems.value = updatedComponentData.items;
            return updatedComponentData;
        } catch (err) {
            fb.value.setError(err, model);
            throw err;
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const deleteComponent = async (componentId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            await ComponentService.deleteComponent(componentId);
            components.value = components.value.filter(c => c.component_id !== componentId);
            fb.value.showSuccess('Component deleted successfully');
        } catch (err) {
            fb.value.setError(err, model);
            throw err;
        } finally {
            fb.value.finishLoading(model);
        }
    };
    
    const uploadComponentImages = async (files, property, componentId) => {
        fb.value.clearError('media.files.upload.' + property);
        fb.value.loading['media.files.upload.' + property] = true;
        fb.value.loading['media.files.delete.' + property] = true;
        try {
            const response = await ComponentService.uploadComponentImages(files, property, componentId);
            console.log('Raw upload response:', response);
            
            response.files = response.files.map(file => {
                // Create the image object
                const imageObject = new FileModel(file);
                
                // Make sure the image path is fully qualified
                if (file.objectURL) {
                    imageObject.objectURL = mediaUrl(file.objectURL);
                }
                return imageObject;
            });
            
            fb.value.showSuccess('media.files.upload.' + property);
            return response;
        } catch (err) {
            fb.value.setError(err, 'media.files.upload.' + property);
            throw err;
        } finally {
            fb.value.finishLoading('media.files.upload.' + property);
        }
    };
    const uploadComponentImage = async (files, property, componentId) => {
        fb.value.clearError('media.files.upload.' + property);
        fb.value.removeSuccess('media.files.upload.' + property);
        fb.value.startLoading('media.files.upload.' + property);
        try {
            const response = await ComponentService.uploadComponentImages(files, property, componentId);
            console.log('Raw upload response:', response);
            
            response.files = response.files.map(file => {
                // Create the image object
                const imageObject = new FileModel(file);
                
                // Make sure the image path is fully qualified
                if (file.objectURL) {
                    imageObject.objectURL = mediaUrl(file.objectURL);
                }
                return imageObject;
            });
            
            fb.value.showSuccess('media.files.upload.' + property);
            return response;
        } catch (err) {
            fb.value.setError(err, 'media.files.upload.' + property);
            throw err;
        } finally {
            fb.value.finishLoading('media.files.upload.' + property);
        }
    };
    const uploadComponentMobileBanner = async (files, property, componentId) => {
        fb.value.clearError('media.files.upload.' + property);
        fb.value.removeSuccess('media.files.upload.' + property);
        fb.value.startLoading('media.files.upload.' + property);
        try {
            const response = await ComponentService.uploadComponentImages(files, property, componentId);
            response.files = response.files.map(file => {
                // Create the image object
                const imageObject = new FileModel(file);
                
                // Make sure the image path is fully qualified
                if (file.objectURL) {
                    imageObject.objectURL = mediaUrl(file.objectURL);
                }
                return imageObject;
            });
            
            fb.value.showSuccess('media.files.upload.' + property);
            return response;
        } catch (err) {
            fb.value.setError(err, 'media.files.upload.' + property);
            throw err;
        } finally {
            fb.value.finishLoading('media.files.upload.' + property);
        }
    };

    const deleteImageByFilePath = async (filepath, property, componentId) => {
        fb.value.clearError(model+'.images');
        fb.value.removeSuccess(model+'.images');
        fb.value.startLoading(model+'.images');
        try {
            const response = await ComponentService.deleteImageByFilePath(filepath, property, componentId);
            fb.value.showSuccess('Image deleted successfully');
            return response;
        } catch (err) {
            fb.value.setError(err, model+'.images');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.images');
        }
    };

    const updateComponentWayPoints = async (componentId, wayPoints) => {
        fb.value.clearError(model+'.wayPoints.'+componentId);
        fb.value.removeSuccess(model+'.wayPoints.'+componentId);
        fb.value.startLoading(model+'.wayPoints.'+componentId);
        try {
            const property = 'component';
            const response = await ComponentService.updateComponentWayPoints(componentId, property, wayPoints);
            let updatedWayPoints = [];
            if (Array.isArray(response)) {
                updatedWayPoints = response;
            } else if (response && Array.isArray(response.way_points)) {
                updatedWayPoints = response.way_points;
            } else {
                updatedWayPoints = wayPoints;
            }

            componentData.value.banner_way_points = updatedWayPoints;
            fb.value.showSuccess(model+'.wayPoints.'+componentId);
            return response;
        } catch (err) {
            fb.value.setError(err, model+'.wayPoints.'+componentId);
            throw err;
        } finally {
            fb.value.finishLoading(model+'.wayPoints.'+componentId);
        }
    };

    // search for way point suggestions
    const getWayPointSuggestions = async (query) => {
        fb.value.clearError(model+'.way-points-suggestions.'+query);
        fb.value.removeSuccess(model+'.way-points-suggestions.'+query);
        fb.value.startLoading(model+'.way-points-suggestions.'+query);
        try {
            const response = await ComponentService.getWayPointSuggestions(query);

            return response;
        } catch (err) {
            fb.value.setError(err, model+'.way-points-suggestions.'+query);
            throw err;
        } finally {
            fb.value.finishLoading(model+'.way-points-suggestions.'+query);
        }
    };



    return { 
        resetComponent,
        components, 
        componentData,
        componentItems,
        fb,
        fetchComponents, 
        fetchComponentById, 
        createComponent, 
        updateComponent, 
        deleteComponent,
        uploadComponentImages,
        uploadComponentImage,
        uploadComponentMobileBanner,
        deleteImageByFilePath,
        updateComponentWayPoints,
        getWayPointSuggestions
    };
}); 