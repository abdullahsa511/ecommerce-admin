import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/booking-management';
const NOTIFICATION_URL = import.meta.env.VITE_API_BASE_URL + '/send-absent-customer-notification';
const CANCEL_BOOKING_ADMIN = import.meta.env.VITE_API_BASE_URL + '/cancel-booking-by-admin';
const API_URL_CONTACT_PERSONS = import.meta.env.VITE_API_BASE_URL + '/members-by-showroom-id/4';

export default class BookingManagementService {

    static async fetchBookingManagements(userId, showroomId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${userId}/${showroomId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }

    static async getBookingManagements() {

        return new Promise((resolve, reject) => {
            axios.get(API_URL)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static async getBookingManagementById(id) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${id}`)
                .then(response => {
                    resolve(response.data);
                })
            .catch(error => {
                console.error('Error fetching booking requests:', error);
                reject(error);
            });
        });
    }

    static async createBookingManagement(newBookingManagement) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL + '/add', newBookingManagement, {
                headers: {'Content-Type': 'application/json'}
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error creating booking management:', error);
                reject(error);
            });
        });
    }

    static async updateBookingManagement(bookingManagementId, updatedBookingManagement) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/${bookingManagementId}`, updatedBookingManagement, {
              headers: {'Content-Type': 'application/json'}
          })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error updating booking management:', error);
                reject(error);
            });
        });
    }

    static async deleteBookingManagement(id) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${id}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error deleting booking management:', error);
                reject(error);
            });
        });
    }

    // BookingManagementService
    static async fetchContactPersons() {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL_CONTACT_PERSONS}`, {
                headers: {'Content-Type': 'application/json'}
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static async sendAbsentEmail(visitShowroomId) {
        return new Promise((resolve, reject) => {
            axios.post(`${NOTIFICATION_URL}/${visitShowroomId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error sending absent email:', error);
                return reject(error);
            });
        });
    }

    static async cancelBooking(visitShowroomId) {
        return new Promise((resolve, reject) => {
            axios.post(`${CANCEL_BOOKING_ADMIN}/${visitShowroomId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error sending absent email:', error);
                return reject(error);
            });
        });
    }
} 