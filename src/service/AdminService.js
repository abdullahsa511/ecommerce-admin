import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/admins';

export default class AdminService {

    static getAdmins() {
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

    static getAdminById(adminId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${adminId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        })
    }
    // Create a new post
    static createAdmin(newAdmin) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newAdmin)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Admin:', error);
                    reject(error);
                });
        });
    }

    static updateAdmin(adminId, updatedAdmin) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${adminId}`, updatedAdmin)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    static deleteAdmin(adminId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${adminId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    // import admin users from CSV
    static async adminUsersImport(formData) {
        try {
            const response = await axios.post(`${API_URL}/import`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error importing admin users:', error);
            throw error;
        }
    }

    // upload vendor images
    static async uploadUserImages(files, property, userId) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            for(const file of files) {
                formData.append(file.index.toString(), file.file);
            }
            // Add property to form data for backend processing
            if (property) {
                formData.append('property', property);
            }
            
            axios.post(`${API_URL}/${userId}/upload`, formData, {
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

    // delete vendor images
    static async deleteUserImages(file, userId) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/${userId}/delete`, {file: file})
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }

} 