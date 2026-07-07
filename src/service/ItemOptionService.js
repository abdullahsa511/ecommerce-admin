import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/item-options';

export default class ItemOptionService {

    static getItemOptions() {
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

    static getItemOptionById(itemOptionId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${itemOptionId}`)
                .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new post
    static createItemOption(newItemOption) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newItemOption, {
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

    static updateItemOption(updatedItemOption) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${updatedItemOption.item_option_id}`, updatedItemOption, {
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

    static deleteItemOption(id) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${id}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteItemOptionGroup(group) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/delete-option-group`, group)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static async importItemOptions(fromData) {
        // alert('importOptions');
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

    // upload item option images
    static async uploadItemOptionImages(files, property, itemOptionId) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            for(const file of files) {
                formData.append(file.index.toString(), file.file);
            }
            // Add property to form data for backend processing
            if (property) {
                formData.append('property', property);
            }
            console.log( "formData item option images", formData);
            axios.post(`${API_URL}/${itemOptionId}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error uploading files:', error);
                reject(error);
            });
        });
    }

    // delete item option images
    static async deleteItemOptionImages(file, itemOptionId) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/${itemOptionId}/delete`, {file: file})
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    
} 