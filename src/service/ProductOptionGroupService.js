import axios from 'axios';
const API_URL = (import.meta.env.VITE_API_BASE_URL || '') + '/product-option-groups'; // product-option-groups
const API_URL_SEARCH = (import.meta.env.VITE_API_BASE_URL || '') + '/item-option-group-search';

export default class ProductOptionGroupService {

  static async getOptionGroups() {
    try {
      const response = await axios.get(API_URL);
      // console.log('Response data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching product option groups:', error);
      throw error;
    }
  }
  static async getProductOptionGroupById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product option group:', error);
      throw error;
    }
  }

  static createOptionGroup(newOptionGroup) {
      return new Promise((resolve, reject) => {
          axios.post(API_URL, newOptionGroup, {
              headers: {'Content-Type': 'application/json'}
          })
          .then(response => {
              console.log('rqs ', response);
              resolve(response.data);
          })
          .catch(error => {
                console.error('Error creating option group:', error);
              reject(error);
          });
      });
  }

  static updateProductOptionGroup(optionGroup) {
    console.log('service updateProductOptionGroup before update', optionGroup);
        return new Promise((resolve, reject) => {
          axios.put(`${API_URL}/${optionGroup.product_option_group_id}`, optionGroup, {
              headers: {'Content-Type': 'application/json'}
          })
          .then(response => {
              resolve(response.data);
          })
          .catch(error => {
              console.error('Error updating option group:', error);
              reject(error);
          });
      });
  }

    static deleteOptionGroup(optionGroupId) {
      return new Promise((resolve, reject) => {
          axios.delete(`${API_URL}/${optionGroupId}`)
          .then(response => {
              resolve(response.data);
          })
          .catch(error => {
              console.error('Error deleting option group:', error);
              reject(error);
          });
      });
    }

  // import options from CSV
  static async importOptionGroups(fromData) {
    // alert('importVariants');
    try {
      const response = await axios.post(`${API_URL}/import`, fromData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error importing product option groups:', error);
      throw error;
    }
  }

  static searchOptionGroups(query, productId, variantId) {
    console.log("this is seach option groups", query, productId, variantId);
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL_SEARCH}?query=${query}&product_id=${productId}&variant_id=${variantId}`)
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
