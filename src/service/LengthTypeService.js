import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/length-types';
const API_URL_IMPORT = (import.meta.env.VITE_API_BASE_URL || '') + '/import-length-types';

export default class LengthTypeService {

    static getLengthTypes() {
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

    static getLengthTypeById(lengthTypeId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${lengthTypeId}`)
                .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new post
    static createLengthType(newLengthType) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newLengthType, {
                headers: {'Content-Type': 'application/json'}
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Length Type:', error);
                    reject(error);
                });
        });
    }

    static updateLengthType(updatedLengthType) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${updatedLengthType.length_type_id}`, updatedLengthType, {
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

    static deleteLengthType(lengthTypeId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${lengthTypeId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static async importLengthTypes(fromData) {
        // alert('importVariants');
        try {
          const response = await axios.post(`${API_URL_IMPORT}`, fromData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          return response.data;
        } catch (error) {
          console.error('Error importing length types:', error);
          throw error;
        }
      }
    
} 