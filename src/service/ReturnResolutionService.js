import axios from 'axios';


const API_URL = import.meta.env.VITE_API_BASE_URL + '/return-resolutions'; 
const API_URL_IMPORT = import.meta.env.VITE_API_BASE_URL + '/return-resolutions/import';

export class ReturnResolutionService {
    static getReturnResolutions() {
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

    static getReturnResolutionById(returnResolutionId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${returnResolutionId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new post
    static createReturnResolution(newReturnResolution) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newReturnResolution)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Return Resolution:', error);
                    reject(error);
                });
        });
    }

    static updateReturnResolution(returnResolutionId, updatedReturnResolution) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${returnResolutionId}`, updatedReturnResolution)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteReturnResolution(returnResolutionId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${returnResolutionId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static async returnResolutionsImport(fromData) {
        try {
          const response = await axios.post(`${API_URL_IMPORT}`, fromData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          return response.data;
        } catch (error) {
          console.error('Error importing stock statuses:', error);
          throw error;
        }
      }
} 