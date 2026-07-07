import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_BASE_URL || '') + '/product-options';
const API_URL_SEARCH = (import.meta.env.VITE_API_BASE_URL || '') + '/item-option-search';

export default class ProductOptionService {
  // static async getProductOptions(): Promise<ProductOption[]> {
  static async getProductOptions() {
    return new Promise((resolve, reject) => {
      axios.get(API_URL + '/list')
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          return reject(error);
        });
    })
  }

  static createProductOption(newProductOption) {
    return new Promise((resolve, reject) => {
      axios.post(API_URL + '/create', newProductOption, {
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          console.error('Error creating product option:', error);
          reject(error);
        });
    });
  }

  static getProductOptionById(id) {
    return new Promise((resolve, reject) => {
      axios.get(`${API_URL}/detail/${id}`)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          console.error('Error fetching product option:', error);
          reject(error);
        });
    });
  }

  static updateProductOption(productOption) {
    return new Promise((resolve, reject) => {
      axios.put(`${API_URL}/update/${productOption.product_option_id}`, productOption, {
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          console.error('Error updating product option:', error);
          reject(error);
        });
    });
  }

  static deleteProductOption(id) {
    return new Promise((resolve, reject) => {
      axios.delete(`${API_URL}/delete/${id}`)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          console.error('Error deleting product option:', error);
          reject(error);
        });
    });
  }

  // import product options from CSV
  static async productOptionsImport(fromData) {
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

  static searchOption(query, productId, variantId, optionGroupId) {
    console.log("this is seach options", query, productId, variantId, optionGroupId);
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL_SEARCH}?query=${query}&product_id=${productId}&variant_id=${variantId}&option_group_id=${optionGroupId}`)
          .then(response => {
              resolve(response.data);
          })
          .catch(error => {
              console.error('Error fetching items:', error);
              reject(error);
          });
    });
  }
}
