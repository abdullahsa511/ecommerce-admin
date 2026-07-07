import { defineStore } from 'pinia';
import MediaService from '@/service/MediaService';
import { ref, computed } from 'vue';
import FeedbackHandler from '../utils/FeedbackHandler';
import { FileModel } from '@/models/Media';
import { mediaUrl } from '@/utils/mediaUrl';

export const useMediaStore = defineStore('media', () => {
    const files = ref([]);
    const breadcrumbs = ref([]);
    const folders = ref([]);
    const subFolders = ref([]);
    const folderFiles = ref([]);
    const metrics = ref({});
    const fb = ref(new FeedbackHandler());

    // const wayPoints = ref([]);
    // const WayPoint = ref(new WayPoint());

    const model = 'media';

    const getFiles = computed(() => files.value);
    const getBreadcrumbs = computed(() => breadcrumbs.value);
    const getFolders = computed(() => folders.value);
    const getSubFolders = computed(() => subFolders.value);
    const getMetrics = computed(() => metrics.value);
    const currentFolder = ref({});

    async function fetchFiles() {
        fb.value.clearError(model+'.fetch.files');
        fb.value.removeSuccess(model+'.fetch.files');
        fb.value.startLoading(model+'.fetch.files');
        try {
            const response = await MediaService.getFiles();
                files.value = response.map(file => {
                    let fileObject = {};
                if(!file?.ObjectURL && file?.file && typeof file.file === 'string') {
                    fileObject = JSON.parse(file.file);
                    fileObject.objectURL = mediaUrl(fileObject.objectURL);
                    fileObject.media_id = file.media_id;
                }
                return new FileModel(fileObject);
            });
            // console.log(folderFiles.value);
            fb.value.showSuccess('Files fetched successfully', model+'.fetch.files');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model+'.fetch.files');
        } finally {
            fb.value.finishLoading(model+'.fetch.files');
        }
    }

    async function fetchFolders() {
        fb.value.clearError(model+'.folders');
        fb.value.removeSuccess(model+'.folders');
        fb.value.startLoading(model+'.folders');
        try {
            const response = await MediaService.getFolders();
            // console.log("response", response);
            // folders.value = response
            const foldersArray = Object.values(response).filter(
                item => typeof item === 'object' && item.media_id
            );

            folders.value = foldersArray;
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model+'.folders');
        } finally {
            fb.value.finishLoading(model+'.folders');
        }
    }

    async function fetchSubFolders(folderId, folderName = null) {
        // console.log("fetchSubFolders called", folderId, folderName);
        fb.value.clearError(model+'.subFolders.' + folderId);
        fb.value.removeSuccess(model+'.subFolders.' + folderId);
        fb.value.startLoading(model+'.subFolders.' + folderId);
        try {
            const response = await MediaService.getSubFolders(folderId, folderName || null);
            currentFolder.value = response.currentFolder;
            breadcrumbs.value = response.breadcrumb;

            const foldersArray = Object.values(response.media_folders).filter(
                item => typeof item === 'object' && item.media_id
            );
            // folders.value = response.media_folders;
            folders.value = foldersArray;
            subFolders.value = response.folders;
            folderFiles.value = response.files?.map(file => {
                if(!file?.ObjectURL && file?.file && typeof file.file === 'string') {
                    file = JSON.parse(file.file);
                    file.objectURL = mediaUrl(file.objectURL);
                    
                }
                return new FileModel(file);
            });
            // console.log(folderFiles.value);
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model+'.subFolders.' + folderId);
        } finally {
            fb.value.finishLoading(model+'.subFolders.' + folderId);
        }
    }

    async function fetchMetrics() {
        fb.value.clearError(model+'.metrics');
        fb.value.removeSuccess(model+'.metrics');
        fb.value.startLoading(model+'.metrics');
        try {
            const response = await MediaService.getMetrics();
            metrics.value = response;
            fb.value.showSuccess('Metrics fetched successfully', model+'.metrics');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model+'.metrics');
        } finally {
            fb.value.finishLoading(model+'.metrics');
        }
    }

    // async function uploadFile(file) {
    //     loading.value = true;
    //     error.value = null;
    //     try {
    //         const uploadedFile = await MediaService.uploadFile(file);
    //         files.value.unshift(uploadedFile);
    //         return uploadedFile;
    //     } catch (err) {
    //         error.value = err.message;
    //         console.error('Error uploading file:', err);
    //         throw err;
    //     } finally {
    //         loading.value = false;
    //     }
    // }
    const uploadFiles = async (files,id = null ,property, options = {}) => {
        fb.value.clearError(model+'.files.upload.'+property);
        fb.value.removeSuccess(model+'.files.upload.'+property);
        fb.value.startLoading(model+'.files.upload.'+property);
        try {
            const response = await MediaService.uploadFiles(files,id, options);
            response.files = response.files.map(file => {
                if(!file?.ObjectURL && file?.file && typeof file.file === 'string') {
                    file = JSON.parse(file.file);
                }
                if (!file.status) {
                    file.status = { name: 'Uploaded', severity: 'success' };
                }
                // Create the image object
                const imageObject = new FileModel(file);
                
                // Make sure the image path is fully qualified
                if (file.objectURL) {
                    imageObject.objectURL = mediaUrl(file.objectURL);
                }
                // console.log(imageObject);
                return imageObject;
            });
             
            fb.value.showSuccess('Files uploaded successfully', model+'.files.upload.'+property);
            return response;
        } catch (err) {
            fb.value.setError(err, model+'.files.upload.'+property);
            throw err;
        } finally {
            fb.value.finishLoading(model+'.files.upload.'+property);
        }
    };

    const uploadFilesToFolder = async (files, folderId, breadcrumb) => {
        fb.value.clearError(model+'.files.upload.to.folder');
        fb.value.removeSuccess(model+'.files.upload.to.folder');
        fb.value.startLoading(model+'.files.upload.to.folder');
        try {
            const response = await MediaService.uploadFilesToFolder(files, folderId, breadcrumb);
            response.files = response.files.map(file => {
                if (!file.status) {
                    file.status = { name: 'Uploaded', severity: 'success' };
                }
                // Create the image object
                const imageObject = new FileModel(file);
                
                // Make sure the image path is fully qualified
                if (file.objectURL) {
                    imageObject.objectURL = mediaUrl(file.objectURL);
                }
                return imageObject;
            });
            
            fb.value.showSuccess('Files uploaded successfully', model+'.files.upload.to.folder');
            return response;
        } catch (err) {
            fb.value.setError(err, model+'.files.upload.to.folder');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.files.upload.to.folder');
        }
    };

    async function deleteFile(fileId, breadcrumb) {
        fb.value.clearError(model+'.files.delete.'+fileId);
        fb.value.removeSuccess(model+'.files.delete.'+fileId);
        fb.value.startLoading(model+'.files.delete.'+fileId);
        try {
            await MediaService.deleteFile(fileId, breadcrumb);
            files.value = files.value.filter(file => file.media_id !== fileId);
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model+'.files.delete.'+fileId);
            throw err;
        } finally {
            fb.value.finishLoading(model+'.files.delete.'+fileId);
        }
    }
    async function deleteFiles(path, files) {
        fb.value.clearError(model+'.files.delete.files');
        fb.value.removeSuccess(model+'.files.delete.files');
        fb.value.startLoading(model+'.files.delete.files');
        try {
            await MediaService.deleteFiles(path, files);

            const deletedNames = new Set();
            const deletedIds = new Set();
            for (const file of files) {
                if (typeof file === 'string') {
                    deletedNames.add(file);
                } else if (file) {
                    if (file.name) deletedNames.add(file.name);
                    if (file.media_id != null) deletedIds.add(file.media_id);
                }
            }

            folderFiles.value = folderFiles.value.filter(
                (folderFile) =>
                    !(folderFile.media_id != null && deletedIds.has(folderFile.media_id)) &&
                    !(folderFile.name && deletedNames.has(folderFile.name))
            );

            fb.value.showSuccess('Files deleted successfully', model+'.files.delete.files');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model+'.files.delete.files');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.files.delete.files');
        }
    }
    const deleteImageByFilePath = async (filepath, property) => {
        fb.value.clearError(model+'.files.delete.'+property);
        fb.value.removeSuccess(model+'.files.delete.'+property);
        fb.value.startLoading(model+'.files.delete.'+property);
        try {
            const response = await MediaService.deleteFileByPath(filepath);
            fb.value.showSuccess('Image deleted successfully', model+'.files.delete.'+property);
            return response;
        } catch (err) {
            fb.value.setError(err, model+'.files.delete.'+property);
            throw err;
        } finally {
            fb.value.finishLoading(model+'.files.delete.'+property);
        }
    };

    async function addFolder(folder) {
        fb.value.clearError(model+'.add.folder');
        fb.value.removeSuccess(model+'.add.folder');
        fb.value.startLoading(model+'.add.folder');
        try {
            const created = await MediaService.addFolder(folder);
            console.log("created folder", created);
            console.log("folder value", folder.value);

            // if(folder.folder_id) {
            //     subFolders.value.push(created);
            // } else {
            //     folders.value.push(created);
            // }

            fb.value.showSuccess('Folder added successfully', model+'.add.folder');
            return created;
        } catch (err) {
            fb.value.setError(err, model+'.add.folder');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.add.folder');
        }
    }

    async function addFolder_new(folder) {
        fb.value.clearError(model+'.add.folder');
        fb.value.removeSuccess(model+'.add.folder');
        fb.value.startLoading(model+'.add.folder');
    
        try {
            const created = await MediaService.addFolder(folder);
            console.log("created folder", created);
            console.log("folders", folders.value);
            console.log("subFolders", subFolders.value);

            if (!Array.isArray(folders.value)) folders.value = [];
            if (!Array.isArray(subFolders.value)) subFolders.value = [];
    
            // Normalize created to an array
            const createdArray = Array.isArray(created) ? created : [created];
    
            if (folder.folder_id) {
                subFolders.value = [...createdArray, ...subFolders.value]; // keep all existing + new
            } else {
                folders.value = [...createdArray, ...folders.value]; // keep all existing + new
            }

            fb.value.showSuccess('Folder added successfully', model+'.add.folder');
            return created;
        } catch (err) {
            fb.value.setError(err, model+'.add.folder');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.add.folder');
        }
    }

    async function deleteFolder(folderId) {
        fb.value.clearError(model+'.folders.delete.'+folderId);
        fb.value.removeSuccess(model+'.folders.delete.'+folderId);
        fb.value.startLoading(model+'.folders.delete.'+folderId);
        try {
            await MediaService.deleteFolder(folderId);
            folders.value = folders.value.filter(folder => folder.media_id !== folderId);
            subFolders.value = subFolders.value.filter(folder => folder.media_id !== folderId);
            fb.value.showSuccess('Folder deleted successfully', model+'.folders.delete.'+folderId);
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model+'.folders.delete.'+folderId);
            throw err;
        } finally {
            fb.value.finishLoading(model+'.folders.delete.'+folderId);
        }
    }

    const getMediaById = async (id) => {
        fb.value.clearError(model + '.update');
        fb.value.removeSuccess(model + '.update');
        fb.value.startLoading(model + '.update');
        try {
            const wp = await MediaService.getMediaById(id);
            wayPoints.value = new WayPoint(wp);
            fb.value.showSuccess(model + '.update');
            return wayPoints.value;
        } catch (err) {
            fb.value.setError(err, model + '.update');
        } finally {
            fb.value.finishLoading(model + '.update');
        }
    };

    return {
        files,
        fb,
        breadcrumbs,
        currentFolder,
        folders,
        subFolders,
        folderFiles,
        metrics,
        getFiles,
        getBreadcrumbs,
        getFolders,
        getSubFolders,
        getMetrics,
        fetchFiles,
        fetchFolders,
        fetchSubFolders,
        fetchMetrics,
        uploadFiles,
        uploadFilesToFolder,
        deleteFile,
        deleteFiles,
        deleteImageByFilePath,
        addFolder,
        deleteFolder,
        getMediaById,
    };
});