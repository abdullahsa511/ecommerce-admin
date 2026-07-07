import axios from 'axios';
import Type from '@/models/Type';

const API_URL = (import.meta.env.VITE_API_BASE_URL || '') + '/types';
const API_URL_IMPORT = (import.meta.env.VITE_API_BASE_URL || '') + '/type-import';

// const API_URL_DELETE = (import.meta.env.VITE_API_BASE_URL || '') + '/types-delete';

export default class TypeService {
  static async getTypes() {
    try {
      const response = await axios.get(API_URL);

      // Map API data to ProductType instances
      return response.data;
    } catch (error) {
      console.error('Error fetching product options:', error);
      throw error;
    }
  }

  static createType(newType) {
      return new Promise((resolve, reject) => {
          axios.post(API_URL, newType, {
              headers: {'Content-Type': 'application/json'}
          })
          .then(response => {
              console.log('rqs ', response);
              resolve(response.data);
          })
          .catch(error => {
              console.error('Error creating type:', error);
              reject(error);
          });
      });
  }
  static getTypeById(id) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${id}`)
                .then(response => {
                    resolve(response.data);
                })
            .catch(error => {
                console.error('Error fetching type:', error);
                reject(error);
            });
        });
    }

  static updateType(type) {
      return new Promise((resolve, reject) => {
        axios.put(`${API_URL}/${type.type_id}`, type, {
              headers: {'Content-Type': 'application/json'}
          })
          .then(response => {
              console.log('rqs ', response);
              resolve(response.data);
          })
          .catch(error => {
              console.error('Error creating type:', error);
              reject(error);
          });
      });
  }

    static deleteType(id) {
      return new Promise((resolve, reject) => {
          axios.delete(`${API_URL}/${id}`)
          .then(response => {
              resolve(response.data);
          })
          .catch(error => {
              console.error('Error deleting type:', error);
              reject(error);
          });
      });
    }

  // import options from CSV
  static async importTypes(fromData) {
    try {
      const response = await axios.post(`${API_URL_IMPORT}`, fromData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error importing type:', error);
      throw error;
    }
  }
}
