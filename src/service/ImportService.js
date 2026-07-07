import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/user-import';
const USER_EXPORT_URL = import.meta.env.VITE_API_BASE_URL + '/user-export';



export default class ImportService {
    static createImport(newImport) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newImport)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Import:', error);
                    reject(error);
                });
        });
    }

    static userExport() {
        return new Promise((resolve, reject) => {
            axios.get(USER_EXPORT_URL, {
                responseType: 'blob',
                headers: {
                    'Accept': 'text/csv, application/json'
                }
            })
                .then(response => {
                    if (!response.data) {
                        throw new Error('No data received from server');
                    }
                    resolve(response);
                })
                .catch(error => {
                    console.error('Error creating Export:', error);
                    reject(error);
                });
        });
    }
}