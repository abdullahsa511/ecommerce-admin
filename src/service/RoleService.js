import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/roles'; 

export default class RoleService {

    static getRoles() {
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

    static getRoleById(roleId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${roleId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new post
    static createRole(newRole) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newRole)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Role:', error);
                    reject(error);
                });
        });
    }

    static updateRole(roleId, updatedRole) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${roleId}`, updatedRole)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteRole(roleId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${roleId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static async roleImport(formData) {
        try {
            const response = await axios.post(`${API_URL}/import`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (!response.data) {
                throw new Error('No data received from server');
            }
            return response.data;
        } catch (error) {
            console.error('Error importing roles:', error);
            if (error.response && error.response.data && error.response.data.message) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error('Failed to import roles: ' + error.message);
            }
        }
    }
} 