import axios from 'axios';
import Subscription from '../models/Subscription';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/subscriptions';
const API_URL_IMPORT = (import.meta.env.VITE_API_BASE_URL || '') + '/import-subscriptions';

export default class SubscriptionService {

    static async fetchSubscriptions() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL)
            .then(response => {
                console.log('subscription srvide data', response.data);
                
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }

    static async getSubscribeRequests() {

        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/subscribe-requests`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static async getSubscriptionById(id) {
        
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${id}`)
                .then(response => {
                    resolve(response.data);
                })
            .catch(error => {
                console.error('Error fetching subscriptions:', error);
                reject(error);
            });
        });
    }

    static async createSubscription(newSubscription) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newSubscription, {
                headers: {'Content-Type': 'application/json'}
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error creating subscription:', error);
                reject(error);
            });
        });
    }

    static async updateSubscription(subscriptionId, updatedsubscription) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${updatedsubscription.subscription_id}`, updatedsubscription, {
              headers: {'Content-Type': 'application/json'}
          })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error fetching subscription:', error);
                reject(error);
            });
        });
    }

    static async deleteSubscription(id) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${id}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error deleting subscription:', error);
                reject(error);
            });
        });
    }
} 