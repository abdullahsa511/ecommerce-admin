import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/timezones';

export default class TimezoneService {

    static getTimezones() {
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

    static getTimezoneById(timezoneId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${timezoneId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new post
    static createTimezone(newTimezone) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newTimezone)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Timezone:', error);
                    reject(error);
                });
        });
    }

    static updateTimezone(timezoneId, updatedTimezone) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${timezoneId}`, updatedTimezone)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteTimezone(timezoneId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${timezoneId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }
    
} 