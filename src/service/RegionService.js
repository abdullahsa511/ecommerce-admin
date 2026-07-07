import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/regions'; 

export default class RegionService {

    static getRegions() {
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

    static getRegionById(regionId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${regionId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new post
    static createRegion(newRegion) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newRegion)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Region:', error);
                    reject(error);
                });
        });
    }

    static updateRegion(regionId, updatedRegion) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${regionId}`, updatedRegion)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteRegion(regionId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${regionId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }
    
} 