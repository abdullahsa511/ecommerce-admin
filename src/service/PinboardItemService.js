import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/pinboard-items';
const API_URL_PRODUCT_LIST = import.meta.env.VITE_API_BASE_URL + '/items-product-list';

class PinboardItemService {
    // Get all pinboard items
    static getPinboardItems() {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/items`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching pinboard items:', error);
                    reject(error);
                });
        });
    }

    // Get a single pinboard item by ID
    static getPinboardItemById(pinboardItemId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/items/${pinboardItemId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching pinboard item:', error);
                    reject(error);
                });
        });
    }

    // Create a new pinboard item
    static createPinboardItem(newPinboardItems) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}`, {pinboardItem: newPinboardItems}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error creating pinboard item:', error);
                reject(error);
            });
        });
    }

    // Update an existing pinboard item
    static updatePinboardItem(updatedPinboardItem) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/items/${updatedPinboardItem.pinboard_item_id}`, {pinboardItem: updatedPinboardItem}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error updating pinboard item:', error);
                reject(error);
            });
        });
    }

    // Delete a pinboard item
    static deletePinboardItem(pinboardItemId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/items/${pinboardItemId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error deleting pinboard item:', error);
                reject(error);
            });
        });
    }

    // Delete all pinboard items by pinboard ID
    static deletePinboardItemsByPinboardId(pinboardId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/pinboard/${pinboardId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error deleting pinboard items by pinboard ID:', error);
                reject(error);
            });
        });
    }

    // Get product list
    static getProductList(query) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL_PRODUCT_LIST, 
                { search: query },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error searching products:', error);
                reject(error);
            });
        });
    }
}

export default PinboardItemService; 