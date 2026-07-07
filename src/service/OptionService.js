import axios from 'axios';
import Option from '../models/Option';

const API_URL = (import.meta.env.VITE_API_BASE_URL || '') + '/options';
const API_URL_TYPE = (import.meta.env.VITE_API_BASE_URL || '') + '/option-types';
const API_URL_DELETE = (import.meta.env.VITE_API_BASE_URL || '') + '/options-delete';
const API_URL_PRODUCT = (import.meta.env.VITE_API_BASE_URL || '') + '/product-options';
export default class OptionService {

    // static async getProductOptions(): Promise<ProductOption[]> {
  static async getOptions() {
    // try {
    //   const response = await axios.get(API_URL);
    //   return response.data;
    // } catch (error) {
    //   console.error('Error fetching product options:', error);
    //   throw error;
    // }
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

  static async fetchOptionTypes() {
    try {
      const response = await axios.get(API_URL_TYPE);
      // console.log('type data:', response.data);

      // Return the array of groups directly
      return response.data;
    } catch (error) {
      console.error('Error fetching attribute groups:', error);
      throw error;
    }
  }


  static createOption(newOption) {
      return new Promise((resolve, reject) => {
          axios.post(API_URL, newOption, {
              headers: {'Content-Type': 'application/json'}
          })
          .then(response => {
              resolve(response.data);
          })
          .catch(error => {
              console.error('Error creating showroom:', error);
              reject(error);
          });
      });
  }
  static getOptionById(id) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${id}`)
                .then(response => {
                    resolve(response.data);
                })
            .catch(error => {
                console.error('Error fetching showrooms:', error);
                reject(error);
            });
        });
    }

  static updateOption(option) {
      return new Promise((resolve, reject) => {
        axios.put(`${API_URL}/${option.option_id}`, option, {
              headers: {'Content-Type': 'application/json'}
          })
          .then(response => {
              resolve(response.data);
          })
          .catch(error => {
              console.error('Error creating showroom:', error);
              reject(error);
          });
      });
  }

    static deleteOption(id) {
      return new Promise((resolve, reject) => {
          axios.post(`${API_URL_DELETE}/${id}`)
          .then(response => {
              resolve(response.data);
          })
          .catch(error => {
              console.error('Error deleting showroom:', error);
              reject(error);
          });
      });
    }

  // import options from CSV
  static async optionsImport(fromData) {
    try {
      const response = await axios.post(`${API_URL}/import`, fromData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error importing product options:', error);
      throw error;
    }
  }

  // import product options from CSV
  static async productOptionsImport(fromData) {
    try {
      const response = await axios.post(`${API_URL_PRODUCT}/import`, fromData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error importing product options:', error);
      throw error;
    }
  }
}
