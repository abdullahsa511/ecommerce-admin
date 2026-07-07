import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/users'; 
const API_URL_IMPORT = import.meta.env.VITE_API_BASE_URL + '/users/import';

export default class UserService {

    static getUsers() {
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

    static getUserById(userId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${userId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new post
    static createUser(newUser) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newUser)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating User:', error);
                    reject(error);
                });
        });
    }

    static updateUser(userId, updatedUser) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${userId}`, updatedUser)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteUser(userId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${userId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }
    
    static async usersImport(newImport) {
        try {
            const response = await axios.post(API_URL_IMPORT, newImport, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (!response.data) {
                throw new Error('No data received from server');
            }
            console.log('User Service response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error importing users:', error);
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