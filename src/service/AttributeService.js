import AttributeGroup from '@/models/AttributeGroup';
import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_BASE_URL || '') + '/attributes';
const API_URL_DELETE = (import.meta.env.VITE_API_BASE_URL || '') + '/attribute-delete';
const API_URL_GROUPS = (import.meta.env.VITE_API_BASE_URL || '') + '/attribute-groups';

export default class AttributeService {

    static async getAttributes() {
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
    static async getAttributeGroups() {
        try {
            const response = await axios.get(API_URL_GROUPS);
            // console.log('Response data:', response.data);

            // Map API data to ProductAttribute instances
            return response.data;
        } catch (error) {
            console.error('Error fetching product attributes:', error);
            throw error;
        }
    }

    static createAttribute(newAttribute) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newAttribute, {
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => {
                    console.log('rqs ', response);
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating showroom:', error);
                    reject(error);
                });
        });
    }

    static updateAttribute(updataAttribute) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${updataAttribute.attribute_id}`, updataAttribute, {
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching attribute:', error);
                    reject(error);
                });
        });
    }

    static getAttributeById(id) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${id}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching attribute:', error);
                    reject(error);
                });
        });
    }

    static deleteAttribute(id) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL_DELETE}/${id}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting attribute:', error);
                    reject(error);
                });
        });
    }

    // import attributes from CSV
    static async attributesImport(fromData) {
        try {
            const response = await axios.post(`${API_URL}/import`, fromData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error importing product attributes:', error);
            throw error;
        }
    }
}
