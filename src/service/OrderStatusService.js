import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/order-statuses';
// const API_URL_IMPORT = import.meta.env.VITE_API_BASE_URL + '/stock-statuses-import';

export class OrderStatusService {
    // Get all order statuses
    static getOrderStatuses() {
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

    static getOrderStatusById(orderStatusId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${orderStatusId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new post
    static createOrderStatus(newOrderStatus) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newOrderStatus)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Order Status:', error);
                    reject(error);
                });
        });
    }

    static updateOrderStatus(updatedOrderStatus) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${updatedOrderStatus.order_status_id}`, updatedOrderStatus)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteOrderStatus(orderStatusId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${orderStatusId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }
    static async orderStatusesImport(fromData) {
        try {
          const response = await axios.post(`${API_URL}/import`, fromData, {    
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          return response.data;
        } catch (error) {
          console.error('Error importing Order Statuses:', error);
          throw error;
        }
      }
} 