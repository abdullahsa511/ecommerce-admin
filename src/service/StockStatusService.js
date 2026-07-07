import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/stock-statuses'; 

export class StockStatusService {

    static getStockStatuses() {
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

    static getStockStatusById(stockStatusId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${stockStatusId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new post
    static createStockStatus(newStockStatus) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newStockStatus)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Stock Status:', error);
                    reject(error);
                });
        });
    }

    static updateStockStatus(stockStatusId, updatedStockStatus) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${stockStatusId}`, updatedStockStatus)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteStockStatus(stockStatusId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${stockStatusId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }
    static async stockStatusesImport(fromData) {
        try {
          const response = await axios.post(`${API_URL}/import`, fromData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          return response.data;
        } catch (error) {
          console.error('Error importing Stock Statuses:', error);
          throw error;
        }
      }
} 