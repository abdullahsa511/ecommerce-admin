import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/design-resources/textiles';
const API_URL_TYPES = import.meta.env.VITE_API_BASE_URL + '/design-resources/types';
const API_RESOURCE_URL = import.meta.env.VITE_API_BASE_URL + '/design-resources';
const API_URL_IMPORT = (import.meta.env.VITE_API_BASE_URL || '') + '/textiles-import';
const API_DOCUMENT_URL = import.meta.env.VITE_API_BASE_URL + '/design-resources/documents';
const API_UPLOAD_URL = import.meta.env.VITE_API_BASE_URL + '/design-resources/upload';

export default class DesignResourceTextileService {

    static getTextiles() {
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
    static getTypes() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL_TYPES + '?resource_type=textiles')
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        })
    }

    static getTextileById(textileId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_RESOURCE_URL}/${textileId}?resource_type=textiles`)
                .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new post
    static createTextile(newTextile) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL + '/create', newTextile, {
                headers: {'Content-Type': 'application/json'}
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating textile:', error);
                    reject(error);
                });
        });
    }

    static updateTextile(updatedTextile) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/update/${updatedTextile.design_resource_id}`, updatedTextile, {
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

    static deleteTextile(textileId) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/delete/${textileId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static async uploadFiles(files, property, id) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            for (const file of files) {
                formData.append(file.index.toString(), file.file);
            }

            formData.append('property', property);
            formData.append('resource_type', 'textiles');
            axios.post(`${API_UPLOAD_URL}/${id}`, formData, {
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

    static async importTextiles(fromData) {
        // alert('importVariants');
        try {
          const response = await axios.post(`${API_URL_IMPORT}`, fromData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          return response.data;
        } catch (error) {
          console.error('Error importing textiles:', error);
          throw error;
        }
      }
    
} 