import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/comments';

export default class CommentService {

    static getComments() {
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

    static getCommentById(CommentId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${CommentId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new post
    static createComment(newComment) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newComment)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Comment:', error);
                    reject(error);
                });
        });
    }

    static updateComment(CommentId, updatedComment) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${CommentId}`, updatedComment)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteComment(CommentId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${CommentId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }
    
} 