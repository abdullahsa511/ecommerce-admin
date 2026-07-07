import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/pages';

class PageService {
    // Get all pages
    static getPages() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL)
                .then(response => {
                    // console.log('Raw axios response:', response);
                    // console.log('Response data:', response.data);
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching pages:', error);
                    reject(error);
                });
        });
    }

    // Get a single page by ID
    static getPageById(pageId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${pageId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching page:', error);
                    reject(error);
                });
        });
    }

    // Create a new page
    static createPage(newPage) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, {page: newPage}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error creating page:', error);
                reject(error);
            });
        });
    }

    // Update an existing page
    static updatePage(updatedPage) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${updatedPage.post_id}`, {page: updatedPage}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error updating page:', error);
                reject(error);
            });
        });
    }

    // Delete a product
    static deletePage(pageId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${pageId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error deleting page:', error);
                reject(error);
            });
        });
    }

    static getPageStatuses() {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}-statuses`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error fetching page statuses:', error);
                reject(error);
            });
        });
    }

    // page upload service
    static async uploadFiles(files, property, pageId) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            for(const file of files) {
                formData.append(file.index.toString(), file.file);
            }
            // Add property to form data for backend processing
            if (property) {
                formData.append('property', property);
            }
            
            axios.post(`${API_URL}/${pageId}/upload`, formData, {
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

    static async deleteFileByPath(filepath, property, pageId) {
        return new Promise((resolve, reject) => {        
            
            axios.post(`${API_URL}/delete-by-path`, {path: filepath, property: property, page_id: pageId})
            .then(response => {
                console.log('Delete response:', response.data);
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error deleting image:', error);
                reject(error);
            });
        });
    }


}

export default PageService; 