import axios from 'axios';
const API_URL_MEDIA = import.meta.env.VITE_API_BASE_URL + '/media-folders';  
const API_URL_MEDIA_FILES = import.meta.env.VITE_API_BASE_URL + '/media-files';
const API_URL_MEDIA_CATEGORIES = import.meta.env.VITE_API_BASE_URL + '/media-categories';

const API_URL_MEDIA_WAY_POINTS = import.meta.env.VITE_API_BASE_URL + '/media-way-points';

class MediaService {
    constructor() {
        this.baseUrl = import.meta.env.VITE_API_BASE_URL + '/media';
    }

    async getFiles() {
        try {
            const response = await axios.get(API_URL_MEDIA_FILES);
            return response.data;
        } catch (error) {
            console.error('Error fetching files:', error);
            throw error;
        }
    }

    async getFolders() {
        try {
            const response = await axios.get(API_URL_MEDIA);
            return response.data;
        } catch (error) {
            console.error('Error fetching folders:', error);
            throw error;
        }
    }

    async getSubFolders(folderId, folderName = null) {

        try {
            let query = folderName ? `?sub=${folderName}` : '';
            const response = await axios.get(`${API_URL_MEDIA}/${folderId}${query}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching sub-folders:', error);
            throw error;
        }
    }

    async getMetrics() {
        try {
            const response = await axios.get(API_URL_MEDIA_CATEGORIES);
            return response.data;
        } catch (error) {
            console.error('Error fetching metrics:', error);
            throw error;
        }
    }

    async uploadFile(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axios.post(`${this.baseUrl}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }
    async uploadFiles(files,id = null, options = {}) {
        return new Promise((resolve, reject) => {
             // Ensure files is always an array
            // if (!files) {
            //     return reject(new Error("No files provided"));
            // } else if (!Array.isArray(files)) {
            //     files = [files];
            // }
            const formData = new FormData();
            for(const file of files) {
                formData.append(file.index.toString(), file.file);
            }
            if(options.size) {
                formData.append('size', JSON.stringify(options.size));
            }
            if(options.property) {
                formData.append('property', options.property);
            }
            if(options.folder){
                formData.append('upload_dir', options.folder);
            }
           if(id){
            formData.append('id', id);
           }
            axios.post(`${this.baseUrl}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error uploading files:', error);
                reject(error);
            });
        });
    }

    async uploadFilesToFolder(files, folderId, breadcrumb) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            for(const file of files) {
                formData.append(file.index.toString(), file.file);
             
            }
            formData.append('breadcrumb',(breadcrumb));
            axios.post(`${this.baseUrl}/upload-to-folder/${folderId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error uploading files:', error);
                reject(error);
            });
        });
    }

    async deleteFile(fileId, breadcrumb) {
        try {
            console.log('path service', breadcrumb);
    
            const response = await axios.post(`${this.baseUrl}/files/${fileId}`, {
                path: breadcrumb
            });
    
            console.log('Delete response:', response.data);
    
            return response.data;
    
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error;
        }
    }
    async deleteFiles(path, files) {
        try {    
            const response = await axios.post(`${this.baseUrl}/delete/files`, {
                path: path,
                files: files
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting files:', error);
            throw error;
        }
    }
    
    async deleteFileByPath(filepath) {
        return new Promise((resolve, reject) => {        
            
            axios.post(`${this.baseUrl}/delete-by-path`, {path: filepath})
            .then(response => {
                console.log('Delete response:', response.data);
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error deleting image:', error);
                reject(error);
            });
        });
    }

    async addFolder(folder) {
        console.log("addFolder service", folder)
        return new Promise((resolve, reject) => {
            axios.post(API_URL_MEDIA, {folder: folder}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error creating folder:', error);
                reject(error);
            });
        });
    }

    async deleteFolder(folderId) {
        try {
            await axios.delete(`${API_URL_MEDIA}/${folderId}`);
            return true;
        } catch (error) {
            console.error('Error deleting folder:', error);
            throw error;
        }
    }

    async getMediaById(id){
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL_MEDIA_WAY_POINTS}/${id}`)
                .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })

    }
}

export default new MediaService();