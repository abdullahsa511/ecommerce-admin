import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/order-items';
const API_URL_PRODUCT_LIST = import.meta.env.VITE_API_BASE_URL + '/items-product-list';

class OrderItemService {
    // Get all order items
    static getOrderItems() {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/items`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching order items:', error);
                    reject(error);
                });
        });
    }

    // Get a single order item by ID
    static getOrderItemById(orderItemId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/items/${orderItemId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching order item:', error);
                    reject(error);
                });
        });
    }

    // Create a new order item
    static createOrderItem(newOrderItem) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}`, {orderItem: newOrderItem}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error creating order item:', error);
                reject(error);
            });
        });
    }

    // Update an existing order item
    static updateOrderItem(updatedOrderItem) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/items/${updatedOrderItem.order_item_id}`, {orderItem: updatedOrderItem}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error updating order item:', error);
                reject(error);
            });
        });
    }

    // Delete an order item
    static deleteOrderItem(orderItemId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/items/${orderItemId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error deleting order item:', error);
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

export default OrderItemService; 