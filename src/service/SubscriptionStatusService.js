import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/subscription-statuses'; 

export class SubscriptionStatusService {
    // Get all subscription statuses
    static getSubscriptionStatuses() {
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

    static getSubscriptionStatusById(subscriptionStatusId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${subscriptionStatusId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new post
    static createSubscriptionStatus(newSubscriptionStatus) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newSubscriptionStatus)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Subscription Status:', error);
                    reject(error);
                });
        });
    }

    static updateSubscriptionStatus(updatedSubscriptionStatus) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${updatedSubscriptionStatus.subscription_status_id}`, updatedSubscriptionStatus)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteSubscriptionStatus(subscriptionStatusId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${subscriptionStatusId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static async subscriptionStatusesImport(fromData) {
        try {
          const response = await axios.post(`${API_URL}/import`, fromData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          return response.data;
        } catch (error) {
          console.error('Error importing Subscription Statuses:', error);
          throw error;
        }
      }
} 