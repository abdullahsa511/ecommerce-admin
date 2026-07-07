import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL + '/showroom-contacts';

export default class ShowroomContactService {
    static async fetchShowroomContacts() {
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

    static async getShowroomContactById(id) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${id}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        })
    }

    static async createShowroomContact(showroomContact) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, showroomContact)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        })
    }

    static async updateShowroomContact(showroomContact) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${showroomContact.showroom_contact_id}`, showroomContact)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        })
    }

    static async deleteShowroomContact(id) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${id}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        })
    }
    static async importShowroomContacts(formData) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/import`, formData)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        })
    }
    // upload manufacturer images
    static async uploadShowroomContactImages(files, property, showroomContactId) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            for (const file of files) {
                formData.append(file.index.toString(), file.file);
            }
            // Add property to form data for backend processing
            if (property) {
                formData.append('property', property);
            }

            axios.post(`${API_URL}/${showroomContactId}/upload`, formData, {
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

    // delete manufacturer images
    static async deleteShowroomContactImages(file, showroomContactId) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/${showroomContactId}/delete`, { file: file })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        })
    }

    static async updateSlotStatus(showroomContactId, slot) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/${showroomContactId}/update-slot`, slot)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        })
    }

    static async fetchSlots(showroomContactId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${showroomContactId}/slots`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        })
    }   
} 