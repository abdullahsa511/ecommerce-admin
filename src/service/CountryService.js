import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/countries';

export default class CountryService {

    static getCountries() {
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

    static getCountryById(countryId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${countryId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new post
    static createCountry(newCountry) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newCountry)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Country:', error);
                    reject(error);
                });
        });
    }

    static updateCountry(countryId, updatedCountry) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${countryId}`, updatedCountry)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteCountry(countryId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${countryId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }
    
} 