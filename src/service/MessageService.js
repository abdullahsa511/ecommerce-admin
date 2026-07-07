import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/comments';

export default class MessageService {

    static getMessages() {
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

    static getMessageById(MessageId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${MessageId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new message
    static createMessage(newMessage) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newMessage)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Message:', error);
                    reject(error);
                });
        });
    }

    static updateMessage(MessageId, updatedMessage) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${MessageId}`, updatedMessage)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteMessage(MessageId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${MessageId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }
    
} 