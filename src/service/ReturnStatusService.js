import axios from 'axios';

 
const API_URL = import.meta.env.VITE_API_BASE_URL + '/return-statuses'; 

export class ReturnStatusService {
    static getReturnStatuses() {
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

    static getReturnStatusById(returnStatusId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${returnStatusId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new post
    static createReturnStatus(newReturnStatus) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newReturnStatus)
                .then(response => {
                    console.log('response from createReturnStatus', response.data);
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Return Status:', error);
                    reject(error);
                });
        });
    }

    static updateReturnStatus(updatedReturnStatus) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${updatedReturnStatus.return_status_id}`, updatedReturnStatus)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteReturnStatus(returnStatusId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${returnStatusId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

     // import return statuses
     static async returnStatusesImport(fromData) {
        try {
          const response = await axios.post(`${API_URL}/import`, fromData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          return response.data;
        } catch (error) {
          console.error('Error importing return statuses:', error);
          throw error;
        }
      }
} 