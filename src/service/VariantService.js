import axios from 'axios';
import Variant from '@/models/Variant';

const API_URL = (import.meta.env.VITE_API_BASE_URL || '') + '/variants';
const API_URL_OPTION = (import.meta.env.VITE_API_BASE_URL || '') + '/product-options';
const API_URL_SEARCH = (import.meta.env.VITE_API_BASE_URL || '') + '/item-option-vairant-search';

export default class VariantService {

  static async getVariants() {
    try {
      const response = await axios.get(API_URL);
      // console.log('Response data:', response.data);

      return response.data;
    } catch (error) {
      console.error('Error fetching product variants:', error);
      throw error;
    }
  }
  static async getVariantById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product variant:', error);
      throw error;
    }
  }

  static createVariant(newVariant) {
      return new Promise((resolve, reject) => {
          axios.post(API_URL, newVariant, {
              headers: {'Content-Type': 'application/json'}
          })
          .then(response => {
              resolve(response.data);
          })
          .catch(error => {
                console.error('Error creating variant:', error);
              reject(error);
          });
      });
  }
  static updateVariant(variant) {
    return new Promise((resolve, reject) => {
      axios.put(`${API_URL}/${variant.product_variant_id}`, variant, {
        headers: {'Content-Type': 'application/json'}
      })
      .then(response => {
              resolve(response.data);
          })
          .catch(error => {
              console.error('Error updating variant:', error);
              reject(error);
          });
      });
  }

  static deleteVariant(variantId) {
    return new Promise((resolve, reject) => {
        axios.delete(`${API_URL}/${variantId}`)
        .then(response => {
            resolve(response.data);
        })
        .catch(error => {
            console.error('Error deleting variant:', error);
            reject(error);
        });
    });
  }

  // import options from CSV
  static async importVariants(fromData) {
    // alert('importVariants');
    try {
      const response = await axios.post(`${API_URL}/import`, fromData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error importing product variants:', error);
      throw error;
    }
  }
  static searchProductVariants(query, productId) {
    console.log("this is seach product variants", query, productId);
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL_SEARCH}?query=${query}&product_id=${productId}`)
        .then(response => {
            resolve(response.data);
        })
        .catch(error => {
            console.error('Error fetching items:', error);
            reject(error);
        });
    });
  }

  static uploadProductVariantGroupOptionImage(files, productOptionId) {
    console.log("adfadfadsf", productOptionId);
    
    return new Promise((resolve, reject) => {
      axios.post(`${API_URL}/${productOptionId}/product-option-upload-image`, files, {
          headers: {'Content-Type': 'multipart/form-data'}
      })
      .then(response => {
          resolve(response.data);
      })
      .catch(error => {
            console.error('Error uploading product variant group option image:', error);
          reject(error);
      });
    });
  }
}