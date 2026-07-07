import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/user-groups'; 

export default class UserGroupService {

    static getUserGroups() {
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

    static getUserGroupById(userGroupId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${userGroupId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new post
    static createUserGroup(newUserGroup) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, {userGroup: newUserGroup}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error creating User Group:', error);
                reject(error);
            });
        });
    }

    static updateUserGroup(userGroupId, updatedUserGroup) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${userGroupId}`, {userGroup: updatedUserGroup}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteUserGroup(userGroupId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${userGroupId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static async userGroupsImport(newImport) {
        try {
            const response = await axios.post(`${API_URL}/import`, newImport, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (!response.data) {
                throw new Error('No data received from server');
            }
            console.log('User Group Service response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error importing users:', error);
            throw error;
        }
    }
} 