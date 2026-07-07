import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import ProjectService from '../service/ProjectService';
import FeedbackHandler from '../utils/FeedbackHandler';
import Project from '../models/Project.ts';
import MediaService from '@/service/MediaService';
import { FileModel } from '@/models/Media.ts';
import { WayPoint } from '@/models/WayPoint';
import { mediaUrl } from '@/utils/mediaUrl';

export const useProjectStore = defineStore('project', () => {
    /**
     * @type {import('vue').Ref<Product[]>}
     */
    const projects = ref([]);
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const files = ref([]);
    const fb = ref(new FeedbackHandler());
    const model = 'project';
    const server = import.meta.env.VITE_API_BASE_URL;
    const categories = ref([]);
    const projectLists = ref([]);
    const projectStatuses = ref([]);
    const project = ref(new Project({}));

    const getFiles = computed(() => files.value);

    const resetProjectForm = () => {
        project.value = new Project();
    };

    const fetchProjects = async () => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ProjectService.getProjects();
            projects.value = response.map(project => new Project(project));
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const projectNames = computed(() => {
        return projects.value.map(project => project.name);
    });

    const fetchProjectById = async (projectId) => {
        fb.value.clearError(model+'.edit.'+projectId);
        fb.value.removeSuccess(model+'.edit.'+projectId);
        fb.value.startLoading(model+'.edit.'+projectId);
        try {
            const projectData = await ProjectService.getProjectById(projectId);
            fb.value.showSuccess(model+'.edit.'+projectId);
            project.value = new Project(projectData);
            if(project.value.banner_way_points.length <= 0) {
                project.value.banner_way_points = [
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
            
            return project.value;
        } catch (err) {
            console.log('err', err);
            fb.value.setError(err, model+'.edit.'+projectId);
            throw err;

            // console.error('Error in fetchProjectById:', err);
            // fb.value.setError(err, model+'.edit.'+projectId);
        } finally {
            fb.value.finishLoading(model+'.edit.'+projectId);
        }
    };

    const createProject = async (newProject) => {
        fb.value.clearError(model+'.create');
        fb.value.removeSuccess(model+'.create');
        fb.value.startLoading(model+'.create');
        try {
            const createdProject = await ProjectService.createProject(newProject);
            let project = new Project(createdProject);
            projects.value.push(project);
            fb.value.showSuccess(model+'.create');
            return project;
        } catch (err) {
            // Set error in fb
            fb.value.setError(err, model+'.create');

            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model+'.create');

            // Extract message from API error if exists
            // let message = 'Failed to save project';
            // if (err.response && err.response.data) {
            //     const data = err.response.data;
            //     if (data.errors && data.errors.length) {
            //         message = data.errors.join(', ');
            //     } else if (data.message) {
            //         message = data.message;
            //     }
            // }

            // // Throw a new Error to trigger component catch
            // throw new Error(message);
        } finally {
            fb.value.finishLoading(model+'.create');
        }
    };

    const updateProject = async (updatedProject) => {
        console.log('pppppppppppp', updatedProject);
        
        fb.value.clearError(model+'.update');
        fb.value.removeSuccess(model+'.update');
        fb.value.startLoading(model+'.update');
        try {
            const updatedProjectData = await ProjectService.updateProject(updatedProject);
            fb.value.showSuccess(model+'.update');
            project.value = new Project(updatedProjectData);
            return project.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model+'.update');
            // fb.value.setError(err, model+'.update');
            // let message = 'Failed to save project';
            //  if (err.response && err.response.data) {
            //     const data = err.response.data;
            //     if (data.errors && data.errors.length) {
            //         message = data.errors.join(', ');
            //     } else if (data.message) {
            //         message = data.message;
            //     }
            // }
            // // Throw a new Error to trigger component catch
            // throw new Error(message);
        } finally {
            fb.value.finishLoading(model+'.update');
        }
    };

    const deleteProject = async (projectId) => {
        fb.value.clearError(model+'.delete.'+projectId);
        fb.value.removeSuccess(model+'.delete.'+projectId);
        fb.value.startLoading(model+'.delete.'+projectId);
        try {
            await ProjectService.deleteProject(projectId);
            projects.value = projects.value.filter(p => p.project_id !== projectId);
            project.value = new Project();
            fb.value.showSuccess(model+'.delete.'+projectId);
        } catch (err) {
            fb.value.setError(err, model+'.delete.'+projectId);
        } finally {
            fb.value.finishLoading(model+'.delete.'+projectId);
        }
    };
    const deleteProjectImage = async (imageId) => {
        fb.value.clearError(model+'.delete-image');
        fb.value.removeSuccess(model+'.delete-image');
        fb.value.startLoading(model+'.delete-image');
        try {
            await ProjectService.deleteProjectImage(imageId);
            project.value.images = project.value.images.filter(img => img.project_image_id !== imageId);
            fb.value.showSuccess(model+'.delete-image');
        } catch (err) {
            fb.value.setError(err, model+'.delete-image');
        } finally {
            fb.value.finishLoading(model+'.delete-image');
        }
    };

    const getCategories = async () => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ProjectService.getCategories();
            categories.value = response;
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const projectList = async () => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ProjectService.getProjectList();
            productLists.value = response;
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const searchProjects = async (query) => {
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
    const getProjectOptionList = async () => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ProjectService.getProjectOptionList();
            fb.value.showSuccess(model);
            return response;
        } catch (err) {
            fb.value.setError(err, model);
            return [];
        }
    }

    const searchCustomers = async (query) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ProjectService.searchCustomers(query);
            fb.value.showSuccess(model);
            return response;
        } catch (err) {
            fb.value.setError(err, model);
            return [];
        } finally {
            fb.value.finishLoading(model);
        }
    };
    const getProjectStatuses = async () => {
        fb.value.clearError(model+"-statuses");
        fb.value.removeSuccess(model+"-statuses");
        fb.value.startLoading(model+"-statuses");
        try {
            const response = await ProjectService.getProjectStatuses();
            projectStatuses.value = response;
            fb.value.showSuccess(model+"-statuses");
            return response;
        } catch (err) {
            fb.value.setError(err, model+"-statuses");
            return [];
        } finally {
            fb.value.finishLoading(model+"-statuses");
        }
    };

    const uploadFiles = async (files, property, projectId) => {
        fb.value.clearError(model+'.files.upload.'+property);
        fb.value.removeSuccess(model+'.files.upload.'+property);
        fb.value.startLoading(model+'.files.upload.'+property);
        try {
            const response = await ProjectService.uploadFiles(files, property, projectId);
            if (property !='project_images') {
                project.value[property] = response.files.map(item => new FileModel(item));
            }else{
                response.files = response.files.map(file => {
                    if(!file?.ObjectURL && file?.file && typeof file.file === 'string') {
                        file = JSON.parse(file.file);
                    }
                    // Create the image object
                    const imageObject = new FileModel(file);
                    
                    // Make sure the image path is fully qualified
                    if (file.objectURL) {
                        // imageObject.objectURL = server + file.objectURL; // api/
                        imageObject.objectURL = mediaUrl(file.objectURL);

                    }
                    console.log('obj ', imageObject);
                    return imageObject;
                });
            }
            fb.value.showSuccess('Files uploaded successfully', model+'.files.upload.'+property);
            return response;
        } catch (err) {
            fb.value.setError(err, model+'.files.upload.'+property);
            throw err;
        } finally {
            fb.value.finishLoading(model+'.files.upload.'+property);
        }
    };

    const deleteImageByFilePath = async (filepath, property, projectId) => {
        fb.value.clearError(model+'.files.delete.'+property);
        fb.value.removeSuccess(model+'.files.delete.'+property);
        fb.value.startLoading(model+'.files.delete.'+property);
        try {
            const response = await ProjectService.deleteFileByPath(filepath, property, projectId);
            fb.value.showSuccess('Image deleted successfully', model+'.files.delete.'+property);
            return response;
        } catch (err) {
            fb.value.setError(err, model+'.files.delete.'+property);
            throw err;
        } finally {
            fb.value.finishLoading(model+'.files.delete.'+property);
        }
    };

    const updateProjectWayPoints = async (projectId, wayPoints) => {
        fb.value.clearError(model+'.way-points.'+projectId);
        fb.value.removeSuccess(model+'.way-points.'+projectId);
        fb.value.startLoading(model+'.way-points.'+projectId);
        try {
            const property = 'project';
            const response = await ProjectService.updateProjectWayPoints(projectId, property, wayPoints);

            // Normalize API response: some backends return the updated array,
            let updatedWayPoints = [];
            if (Array.isArray(response)) {
                updatedWayPoints = response;
            } else if (response && Array.isArray(response.way_points)) {
                updatedWayPoints = response.way_points;
            } else {
                updatedWayPoints = wayPoints;
            }

            project.value.banner_way_points = updatedWayPoints;
            fb.value.showSuccess(model+'.way-points.'+projectId);
            return response;
        } catch (err) {
            fb.value.setError(err, model+'.way-points.'+projectId);
            throw err;
        } finally {
            fb.value.finishLoading(model+'.way-points.'+projectId);
        }
    };

    const getWayPointSuggestions = async (query) => {
        fb.value.clearError(model+'.way-points-suggestions.'+query);
        fb.value.removeSuccess(model+'.way-points-suggestions.'+query);
        fb.value.startLoading(model+'.way-points-suggestions.'+query);
        try {
            const response = await ProjectService.getWayPointSuggestions(query);

            return response;
        } catch (err) {
            fb.value.setError(err, model+'.way-points-suggestions.'+query);
            throw err;
        } finally {
            fb.value.finishLoading(model+'.way-points-suggestions.'+query);
        }
    };

    const removeProjectWayPoint = async (projectId, pointId) => {
        fb.value.clearError(model+'.way-points.remove.'+projectId);
        fb.value.removeSuccess(model+'.way-points.remove.'+projectId);
        fb.value.startLoading(model+'.way-points.remove.'+projectId);
        try {
            await ProjectService.removeProjectWayPoint(projectId, pointId);
            // update the way points
            project.value.banner_way_points = project.value.banner_way_points.filter(point => point.id != pointId);
            fb.value.showSuccess(model+'.way-points.remove.'+projectId);
            return project.value.banner_way_points;
            
        } catch (err) {
            fb.value.setError(err, model+'.way-points.remove.'+projectId);
            throw err;
        } finally {
            fb.value.finishLoading(model+'.way-points.remove.'+projectId);
        }
    };

    // reorderProjectImages

    const reorderProjectImages = async (reordered, projectId) => {
        fb.value.clearError(model+'.reorder-images');
        fb.value.removeSuccess(model+'.reorder-images');
        fb.value.startLoading(model+'.reorder-images');
        try {
            const response = await ProjectService.reorderProjectImages(reordered, projectId);
            fb.value.showSuccess('Images reordered successfully', model+'.reorder-images');
            return response;
        } catch (err) {
            fb.value.setError(err, model+'.reorder-images');
            fb.value.showError('Failed to reorder images. Please try again.', model+'.reorder-images');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.reorder-images');
        }
    }

    const deleteMultipleImagesById = async (files, property = 'images') => {
        try {
            const projectImageIds = files.map(file => file.project_image_id);
            const response = await ProjectService.deleteMultipleImagesById(projectImageIds, property);
            return response;
        } catch (err) {
            console.error('Error deleting model documents:', err);
            throw err;
        }
    };

    return { 
        resetProjectForm,
        projects, 
        project,
        fb, 
        projectNames, 
        categories, 
        projectLists, 
        projectStatuses,
        fetchProjects, 
        fetchProjectById, 
        createProject, 
        updateProject, 
        deleteProject, 
        getCategories, 
        projectList,
        searchProjects,
        searchCustomers,     
        getProjectOptionList,
        getProjectStatuses,
        deleteProjectImage,
        uploadFiles,
        deleteImageByFilePath,
        updateProjectWayPoints,
        getWayPointSuggestions,
        removeProjectWayPoint,
        reorderProjectImages,
        deleteMultipleImagesById
    };
}); 