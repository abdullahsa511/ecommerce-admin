import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/orders';
const API_URL_IMPORT = (import.meta.env.VITE_API_BASE_URL || '') + '/import-orders';

class OrderService {
    // Get all orders
    static getOrders() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching orders:', error);
                    reject(error);
                });
        });
    }

    // Get a single order by ID
    static getOrderById(orderId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${orderId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching order:', error);
                    reject(error);
                });
        });
    }

    // Create a new order
    static createOrder(newOrder) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, {order: newOrder}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error creating order:', error);
                reject(error);
            });
        });
    }

    // Update an existing order
    static updateOrder(updatedOrder) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${updatedOrder.order_id}`, {order: updatedOrder}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error updating order:', error);
                reject(error);
            });
        });
    }

    // Delete an order
    static deleteOrder(orderId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${orderId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error deleting order:', error);
                reject(error);
            });
        });
    }

    static async importOrders(fromData) {
        // alert('importVariants');
        try {
          const response = await axios.post(`${API_URL_IMPORT}`, fromData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          return response.data;
        } catch (error) {
          console.error('Error importing orders:', error);
          throw error;
        }
      }
}

export default OrderService; 