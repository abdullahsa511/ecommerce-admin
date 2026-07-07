import axios from 'axios';


const API_URL = import.meta.env.VITE_API_BASE_URL + '/payment-statuses';

export class PaymentStatusService {
    // Get all payment statuses
    static getPaymentStatuses() {
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

    static getPaymentStatusById(paymentStatusId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${paymentStatusId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new post
    static createPaymentStatus(newPaymentStatus) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newPaymentStatus)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Payment Status:', error);
                    reject(error);
                });
        });
    }

    static updatePaymentStatus(updatedPaymentStatus) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${updatedPaymentStatus.payment_status_id}`, updatedPaymentStatus)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deletePaymentStatus(paymentStatusId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${paymentStatusId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }
    static async paymentStatusesImport(fromData) {
        try {
          const response = await axios.post(`${API_URL}/import`, fromData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          return response.data;
        } catch (error) {
          console.error('Error importing Payment Statuses:', error);
          throw error;
        }
      }
} 