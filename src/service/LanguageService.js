import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/languages';

export default class LanguageService {

    static getLanguages() {
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

    static getLanguageById(languageId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${languageId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new post
    static createLanguage(newLanguage) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newLanguage)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Language:', error);
                    reject(error);
                });
        });
    }

    static updateLanguage(languageId, updatedLanguage) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${languageId}`, updatedLanguage)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteLanguage(languageId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${languageId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }
    
} 