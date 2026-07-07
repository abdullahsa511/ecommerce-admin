import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/region-groups'; 

export default class RegionGroupService {

    static getRegionGroups() {
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

    static getRegionGroupById(regionGroupId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${regionGroupId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new post
    static createRegionGroup(newRegionGroup) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newRegionGroup)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Region Group:', error);
                    reject(error);
                });
        });
    }

    static updateRegionGroup(regionGroupId, updatedRegionGroup) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${regionGroupId}`, updatedRegionGroup)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteRegionGroup(regionGroupId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${regionGroupId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }
    
} 