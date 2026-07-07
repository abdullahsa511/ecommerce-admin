import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/component';

export default class ComponentItemService {
    static getComponentItems(componentId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${componentId}/items`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching Component Items:', error);
                    return reject(error);
                });
        });
    }

    static addComponentItem(componentItem) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/add-items`, componentItem)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error adding Component Items:', error);
                    return reject(error);
                });
        });
    }

    static updateComponentItem(itemId, updatedItem) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/update-items/${itemId}`, updatedItem)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error updating Component Item:', error);
                    return reject(error);
                });
        });
    }

    static deleteComponentItem(itemId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/delete-items/${itemId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting Component Item:', error);
                    return reject(error);
                });
        });
    }
} 