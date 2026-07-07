import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/taxonomies'; 
const API_URL_TYPE = import.meta.env.VITE_API_BASE_URL + '/taxonomy-types';
export default class TaxonomyService {

    static getTaxonomies() {
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

    static getTaxonomyById(taxonomyId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${taxonomyId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new post
    static createTaxonomy(newTaxonomy) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newTaxonomy)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Taxonomy:', error);
                    reject(error);
                });
        });
    }

    static updateTaxonomy(taxonomyId, updatedTaxonomy) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${taxonomyId}`, updatedTaxonomy)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteTaxonomy(taxonomyId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${taxonomyId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }
    // import taxonomies csv
    static async taxonomyImport(formData) {
        try {
            const response = await axios.post(`${API_URL}/import`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error importing taxonomies:', error);
            throw error;
        }
    }
    // get taxonomy types
    static getTaxonomyTypes() {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL_TYPE}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }
} 