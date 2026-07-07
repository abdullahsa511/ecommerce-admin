import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/post-types';

export default class PostTypeService {

    static getPostTypes() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }

    static getPostTypeById(postTypeId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${postTypeId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new post
    static createPostType(newPostType) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newPostType)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Post Type:', error);
                    reject(error);
                });
        });
    }

    static updatePostType(postTypeId, updatedPostType) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${postTypeId}`, updatedPostType)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deletePostType(postTypeId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${postTypeId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    // import taxonomies csv
    static async postTypeImport(formData) {
        try {
            const response = await axios.post(`${API_URL}/import`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error importing post types:', error);
            throw error;
        }
    }

    static async uploadPostTypeImages(files, property, postTypeId) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            for(const file of files) {
                formData.append(file.index.toString(), file.file);
            }
            // Add property to form data for backend processing
            if (property) {
                formData.append('property', property);
            }
            
            axios.post(`${API_URL}/${postTypeId}/upload`, formData, {
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

    // delete vendor images
    static async deletePostTypeImages(file, postTypeId) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/${postTypeId}/delete`, {file: file})
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
} 