import axios from 'axios';
import PostTag from '../models/PostTag';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/post-tags';
const API_URL_IMPORT = (import.meta.env.VITE_API_BASE_URL || '') + '/post-tags/import-post-tags';

export default class PostTagService {

    static getPostTags() {
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

    static getPostTagById(tagId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${tagId}`)
                .then(response => {
                    // resolve(new PostTag(response.data));
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching post tag:', error);
                    return reject(error);
                });
        })
    }

    static createPostTag(newPostTag) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newPostTag, {
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating PostTag:', error);
                    reject(error);
                });
        });
    }

    static updatePostTag(tagId, updatedTag) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${tagId}`, updatedTag,{
                headers: {'Content-Type': 'application/json'}
            })
                .then(response => {
                    resolve(response.data);
                    // resolve(new PostTag(response.data));
                })
                .catch(error => {
                    console.error('Error fetching post tags group:', error);
                    return reject(error);
                });
        });
    }

    static deletePostTag(tagId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${tagId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    static uploadFiles(files, property, postTagId) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            for (const file of files) {
                formData.append(file.index?.toString() || 'file', file.file || file);
            }
            formData.append('property', property);

            console.log("thsi si formarrrr", formData);
            
            axios.post(`${API_URL}/${postTagId}/upload`, formData, {
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

    static deletePostTagImageByProperty(postTagId, property) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${postTagId}/delete-image/${property}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error deleting post image by property:', error);
                reject(error);
            });
        });
    }

    static deleteFileByPath(filepath, property, postTagId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${postTagId}/delete-file`, {
                params: {
                    filepath: filepath,
                    property: property
                }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting file:', error);
                    reject(error);
                });
        });
    }
    // import post tags from CSV
    static async postTagsImport(fromData) {
        try {
        const response = await axios.post(`${API_URL_IMPORT}`, fromData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
        } catch (error) {
        console.error('Error importing psot tags:', error);
        throw error;
        }
    }
} 