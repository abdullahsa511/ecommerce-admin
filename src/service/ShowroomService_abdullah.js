import axios from 'axios';

// const API_URL = '/api/showrooms';
const API_URL = import.meta.env.VITE_API_BASE_URL + '/showroom';
const SHOWROOM_IMPORT_URL = import.meta.env.VITE_API_BASE_URL + '/showrooms-import';
const SHOWROOM_IMAGE_IMPORT_URL = import.meta.env.VITE_API_BASE_URL + '/showroom-image-import';

class ShowroomService {
    // Get all showrooms
    static getShowrooms() {
        // console.log('get showroom ' + API_URL + '/' + 'lists');
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/lists`)
                .then(response => {
                    resolve(response.data);
                    // console.log(response.data);
                })
                .catch(error => {
                    console.error('Error fetching showrooms:', error);
                    reject(error);
                });
        });
    }

    // Get a single showroom by ID
    static getShowroomsById(showroomId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${showroomId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching showrooms:', error);
                    reject(error);
                });
        });
    }

    // Create a new showroom
    static createShowrooms(newShowroom) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, {showroom: newShowroom}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error creating showroom:', error);
                reject(error);
            });
        });
    }

    // Update an existing showroom
    static updateShowroom(updatedShowroom) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${updatedShowroom.showroom_id}`, {showroom: updatedShowroom}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error updating showroom:', error);
                reject(error);
            });
        });
    }

    // Delete a showroom
    static deleteShowroom(showroomId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${showroomId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error deleting showroom:', error);
                reject(error);
            });
        });
    }

    static getShowroomStatuses() {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}-statuses`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error searching showrooms:', error);
                reject(error);
            });
        });
    }
    static uploadFiles(files, property, showroomId) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            for(const file of files) {
                formData.append(file.index.toString(), file.file);
            }
            formData.append('property', property);
            
            axios.post(`${API_URL}/${showroomId}/upload`, formData, {
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

   

    static deleteShowroomImage(imageId) {
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
    // /api/showrooms/{id}/delete-image/{property}

    static deleteShowroomImageByProperty(showroomId, property) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${showroomId}/delete-image/${property}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error deleting showroom image by property:', error);
                reject(error);
            });
        });
    }
    static createShowroomImport(newImport) {
        return new Promise((resolve, reject) => {
            axios.post(SHOWROOM_IMPORT_URL, newImport)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Showroom Import:', error);
                    reject(error);
                });
        });
    }

    static createShowroomImageImport(newImport) {
        return new Promise((resolve, reject) => {
            axios.post(SHOWROOM_IMAGE_IMPORT_URL, newImport)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Showroom Image Import:', error);
                    reject(error);
                });
        });
    }
}

export default ShowroomService; 