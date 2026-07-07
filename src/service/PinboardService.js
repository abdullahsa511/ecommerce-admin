import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/pinboards';
const API_URL_SEND_EMAIL = import.meta.env.VITE_API_BASE_URL + '/automatic-send-email-client';
const API_URL_TEMP = import.meta.env.VITE_API_BASE_URL + '/pinboards-temporary';

class PinboardService {
    // Get all pinboards
    static getPinboards() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching pinboards:', error);
                    reject(error);
                });
        });
    }

    // Get a single pinboard by ID
    static getPinboardById(pinboardId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${pinboardId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching pinboard:', error);
                    reject(error);
                });
        });
    }

    // Create a new pinboard
    static createPinboard(newPinboard) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, { pinboard: newPinboard }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating pinboard:', error);
                    reject(error);
                });
        });
    }

    // Update an existing pinboard
    static updatePinboard(updatedPinboard) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${updatedPinboard.pinboard_id}`, { pinboard: updatedPinboard }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error updating pinboard:', error);
                    reject(error);
                });
        });
    }

    // Delete a pinboard
    static deletePinboard(pinboardId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${pinboardId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting pinboard:', error);
                    reject(error);
                });
        });
    }
    static deleteTemporaryPinboard(pinboardId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL_TEMP}/${pinboardId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting temporary pinboard:', error);
                    reject(error);
                });
        });
    }

    // Import pinboards
    static async pinboardsImport(formData) {
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
            console.error('Error importing pinboards:', error);
            if (error.response && error.response.data && error.response.data.message) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error('Failed to import pinboards: ' + error.message);
            }
        }
    }
    // show pinboard items
    static async showPinboardItems(pinboardId) {
        try {
            const response = await axios.get(`${API_URL}/${pinboardId}`);
            return response.data;
        } catch (error) {
            console.error('Error showing pinboard items:', error);
            throw new Error('Failed to show pinboard items: ' + error.message);
        }
    }

    // accept pinboard
    static async acceptPinboard(pinboardId) {
        try {
            const response = await axios.post(`${API_URL}/${pinboardId}/accept`);
            return response.data;
        } catch (error) {
            console.error('Error accepting pinboard:', error);
            throw new Error('Failed to accept pinboard: ' + error.message);
        }
    }

    // create lead
    static async createLead(pinboardId) {
        try {
            const response =  await axios.post(`${API_URL}/${pinboardId}/lead`);
            return response.data;
        } catch (error) {
            console.error('Error creating lead:', error);
            throw new Error('Failed to create lead: ' + error.message);
        }
    }

    static fetchTemporaryPinboards() {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/temporary-pinboards`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching pinboards:', error);
                    reject(error);
                });
        });
    }

    // Get a single pinboard by ID
    static sendEmailDraftPinboard() {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL_SEND_EMAIL}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching pinboard:', error);
                    reject(error);
                });
        });
    }
}

export default PinboardService; 