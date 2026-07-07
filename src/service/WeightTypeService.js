import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/weight-types';
const API_URL_IMPORT = (import.meta.env.VITE_API_BASE_URL || '') + '/import-weight-types';

export default class WeightTypeService {

    static getWeightTypes() {
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

    static getWeightTypeById(weightTypeId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${weightTypeId}`)
                .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new post
    static createWeightType(newWeightType) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newWeightType, {
                headers: {'Content-Type': 'application/json'}
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Weight Type:', error);
                    reject(error);
                });
        });
    }

    static updateWeightType(updatedWeightType) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${updatedWeightType.weight_type_id}`, updatedWeightType, {
                headers: {'Content-Type': 'application/json'}
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteWeightType(weightTypeId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${weightTypeId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static async importWeightTypes(fromData) {
        // alert('importVariants');
        try {
          const response = await axios.post(`${API_URL_IMPORT}`, fromData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          return response.data;
        } catch (error) {
          console.error('Error importing weight types:', error);
          throw error;
        }
      }
    
} 