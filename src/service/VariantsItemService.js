import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/variant-items';
const API_URL_IMPORT = import.meta.env.VITE_API_BASE_URL + '/variant-item-import';

export default class VariantsItemService {

    static getVariantsItems() {
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

    static getVariantsItemById(variantsItemId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${variantsItemId}`)
                .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new post
    static createVariantsItem(newVariantsItem) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newVariantsItem, {
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

    static updateVariantsItem(updatedVariantsItem) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${updatedVariantsItem.variant_item_id}`, updatedVariantsItem, {
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

    static deleteVariantsItem(variantsItemId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${variantsItemId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static async importVariantsItems(fromData) {
        // alert('importVariants');
        try {
          const response = await axios.post(`${API_URL}/import`, fromData, {
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
      static updateItemVariant(variant) {
        return new Promise((resolve, reject) => {
          axios.put(`${API_URL}/${variant.variant_item_id}`, variant, {
            headers: {'Content-Type': 'application/json'}
          })
          .then(response => {
                  resolve(response.data);
              })
              .catch(error => {
                  console.error('Error updating item variant:', error);
                  reject(error);
              });
          });
    }

    static createItemVariant(data) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, data)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating item variant:', error);
                    reject(error);
                });
        });
    }
} 