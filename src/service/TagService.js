import Tag from '../models/Tag';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/list/'; 

export default class TagService {

    static getPostTags() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL+'post-tags')
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }

    static getTagById(tagId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${tagId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new post
    static createTag(newTag) {
        return new Promise((resolve, reject) => {
            axios.get(API_URL)
                .then(response => {
                    const tags = response.data;
                    tags.push(new Tag(newTag));
                    resolve(newTag);
                })
                .catch(error => {
                    console.error('Error creating tag:', error);
                    reject(error);
                });
        });
    }

    static updateTag(tagId, updatedTag) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${tagId}`, updatedTag)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteTag(tagId) {
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
    
} 