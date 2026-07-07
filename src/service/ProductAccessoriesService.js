import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_BASE_URL || '') + '/product-accessories';
const API_URL_SEARCH = (import.meta.env.VITE_API_BASE_URL || '') + '/item-accessories-search';

export default class ProductAccessoriesService {
  static async getProductAccessoriess() {
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

  static createProductAccessories(newProductAccessories) {
    return new Promise((resolve, reject) => {
      axios.post(API_URL + '/create', newProductAccessories, {
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          console.error('Error creating product accessories:', error);
          reject(error);
        });
    });
  }

  static getProductAccessoriesById(id) {
    return new Promise((resolve, reject) => {
      axios.get(`${API_URL}/${id}`)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          console.error('Error fetching product accessories:', error);
          reject(error);
        });
    });
  }

  static updateProductAccessories(productAccessories) {
    return new Promise((resolve, reject) => {
      axios.put(`${API_URL}/update/${productAccessories.product_accessories_id}`, productAccessories, {
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          console.error('Error updating product accessories:', error);
          reject(error);
        });
    });
  }

  static deleteProductAccessories(id) {
    return new Promise((resolve, reject) => {
      axios.delete(`${API_URL}/delete/${id}`)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          console.error('Error deleting product accessories:', error);
          reject(error);
        });
    });
  }

  // import product accessoriess from CSV
  static async productAccessoriessImport(fromData) {
    try {
      const response = await axios.post(`${API_URL}/import`, fromData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error importing product accessoriess:', error);
      throw error;
    }
  }

  static searchAccessories(query, productId, variantId, accessoriesGroupId) {
    console.log("this is seach accessoriess", query, productId, variantId, accessoriesGroupId);
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL_SEARCH}?query=${query}&product_id=${productId}&variant_id=${variantId}&accessories_group_id=${accessoriesGroupId}`)
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
