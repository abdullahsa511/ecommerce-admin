import axios from 'axios';
import { property } from 'lodash';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/projects';
const API_URL_CATEGORIES = import.meta.env.VITE_API_BASE_URL + '/projects-categories';
const API_URL_PROJECT_LIST = import.meta.env.VITE_API_BASE_URL + '/projects-list';
const API_URL_RELATED_SEARCH = import.meta.env.VITE_API_BASE_URL + '/projects-related-search';
const API_URL_PROJECT_OPTION_LIST = import.meta.env.VITE_API_BASE_URL + '/project-options';
const API_URL_CUSTOMER_SEARCH = import.meta.env.VITE_API_BASE_URL + '/customers-search';
const API_URL_WAY_POINT_SUGGESTIONS = import.meta.env.VITE_API_BASE_URL + '/product-search-for-waypoints';
const API_URL_REORDER_PROJECT_IMAGES = import.meta.env.VITE_API_BASE_URL + '/reorder-project-images';

class ProjectService {
    // Get all products
    static getProjects() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching products:', error);
                    reject(error);
                });
        });
    }

    // Get a single product by ID
    static getProjectById(projectId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${projectId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('ProjectService: Error fetching product:', error);
                    reject(error);
                });
        });
    }

    // Create a new product
    static createProject(newProject) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, {project: newProject}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error creating product:', error.message);
                reject(error);
            });
        });
    }

    // Update an existing product
    static updateProject(updatedProject) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${updatedProject.project_id}`, {project: updatedProject}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error updating product:', error);
                reject(error);
            });
        });
    }

    // Delete a product
    static deleteProject(projectId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${projectId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error deleting product:', error);
                reject(error);
            });
        });
    }

    static deleteProjectImage(imageId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/delete-image/${imageId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error deleting product:', error);
                reject(error);
            });
        });
    }

    static getCategories() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL_CATEGORIES)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static getProjectList() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL_PRODUCT_LIST)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static searchProjects(query) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL_RELATED_SEARCH, 
                { search: query },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error searching products:', error);
                reject(error);
            });
        });
    }

    static getProjectOptionList() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL_PROJECT_OPTION_LIST)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }
    static searchCustomers(query) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL_CUSTOMER_SEARCH, 
                { search: query },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error searching products:', error);
                reject(error);
            });
        });
    }

    static getProjectStatuses() {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}-statuses`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error searching products:', error);
                reject(error);
            });
        });
    }
    static async uploadFiles(files, property, projectId) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            for(const file of files) {
                formData.append(file.index.toString(), file.file);
            }
            // Add property to form data for backend processing
            if (property) {
                formData.append('property', property);
            }
            
            axios.post(`${API_URL}/${projectId}/upload`, formData, {
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

    static async deleteFileByPath(filepath, property, projectId) {
        return new Promise((resolve, reject) => {        
            
            axios.post(`${API_URL}/delete-by-path`, {path: filepath, property: property, project_id: projectId})
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

    static async updateProjectWayPoints(projectId, property, wayPoints) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/update-way-points`, {model_id: projectId, model_type: property, way_points: wayPoints})
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error updating project way points:', error);
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
    // Remove a project way point
    static async removeProjectWayPoint(projectId, pointId) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/remove-way-point`, {project_id: projectId, point_id: pointId})
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error removing project way point:', error);
                reject(error);
            });
        });
    }

    static async reorderProjectImages(reordered, projectId) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL_REORDER_PROJECT_IMAGES}/${projectId}`, reordered)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error reordering project images:', error);
                reject(error);
            });
        });
    }

    static async deleteMultipleImagesById(projectImageIds, property = 'images') {
        console.log('deleteModelDocuments service resourceDocumentIds', projectImageIds);
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/delete-by-ids`, { project_image_ids: projectImageIds, property: property })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting model documents:', error);
                    reject(error);
                });
        });
    }

}

export default ProjectService; 