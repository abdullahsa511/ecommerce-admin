import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/subscription-plans'; 

export default class SubscriptionPlanService {

    static getSubscriptionPlans() {
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

    static getSubscriptionPlanById(subscriptionPlanId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${subscriptionPlanId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new post
    static createSubscriptionPlan(newSubscriptionPlan) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newSubscriptionPlan)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Subscription Plan:', error);
                    reject(error);
                });
        });
    }

    static updateSubscriptionPlan(subscriptionPlanId, updatedSubscriptionPlan) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${subscriptionPlanId}`, updatedSubscriptionPlan)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteSubscriptionPlan(subscriptionPlanId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${subscriptionPlanId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }
    
} 