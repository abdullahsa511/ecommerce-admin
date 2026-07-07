import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/components';
const MEDIA_API_URL = import.meta.env.VITE_API_BASE_URL + '/media';
const API_URL_WAY_POINTS = import.meta.env.VITE_API_BASE_URL + '/components/update-way-points';
const API_URL_WAY_POINT_SUGGESTIONS = import.meta.env.VITE_API_BASE_URL + '/product-search-for-waypoints';

export default class ComponentService {

    static getComponents() {
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

    static getComponentById(componentId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${componentId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }

    static createComponent(newComponent) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newComponent)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Component:', error);
                    reject(error);
                });
        });
    }

    static updateComponent(componentId, updatedComponent) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${componentId}`, updatedComponent)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteComponent(componentId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${componentId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }
    
    static uploadComponentImages(files, property, componentId) {
        console.log('Component ID:', componentId);
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            for(const file of files) {
                formData.append('property', property);
                formData.append(file.index.toString(), file.file);
            }
            
            axios.post(`${API_URL}/${componentId}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error uploading image:', error);
                reject(error);
            });
        });
    }
    
    static deleteImageByFilePath(filepath, property, componentId) {
        return new Promise((resolve, reject) => {        
            axios.post(`${API_URL}/${componentId}/delete-by-path`, {path: filepath, property: property})
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error deleting image:', error);
                reject(error);
            });
        });
    }
    
    // static addComponentItems(componentItems) {
    //     return new Promise((resolve, reject) => {
    //         axios.post(`${API_URL}/add-items`, componentItems)
    //         .then(response => {
    //             resolve(response.data);
    //         })
    //         .catch(error => {
    //             console.error('Error adding Component Items:', error);
    //             return reject(error);
    //         });
    //     });
    // }


    static async updateComponentWayPoints(componentId, property, wayPoints) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL_WAY_POINTS}`, {model_id: componentId, model_type: property, way_points: wayPoints})
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error updating component way points:', error);
                reject(error);
            });
        });
    }

    static async getWayPointSuggestions(query) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL_WAY_POINT_SUGGESTIONS}?search=${query}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error getting way point suggestions:', error);
                reject(error);
            });
        });
    }
} 