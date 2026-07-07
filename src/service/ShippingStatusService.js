import axios from 'axios';


const API_URL = import.meta.env.VITE_API_BASE_URL + '/shipping-statuses'; 
const API_URL_IMPORT = import.meta.env.VITE_API_BASE_URL + '/shipping-statuses/import';

export class ShippingStatusService {
    static getShippingStatuses() {
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

    static getShippingStatusById(shippingStatusId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${shippingStatusId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new post
    static createShippingStatus(newShippingStatus) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newShippingStatus, {
                headers: {'Content-Type': 'application/json'}
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Shipping Status:', error);
                    reject(error);
                });
        });
    }

    static updateShippingStatus(updatedShippingStatus) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${updatedShippingStatus.shipping_status_id}`, updatedShippingStatus)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteShippingStatus(shippingStatusId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${shippingStatusId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }
    // import shipping statuses
    static async shippingStatusesImport(fromData) {
        try {
          const response = await axios.post(`${API_URL_IMPORT}`, fromData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          return response.data;
        } catch (error) {
          console.error('Error importing stock statuses:', error);
          throw error;
        }
      }
} 