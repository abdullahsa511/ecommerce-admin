import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/list/';

export default class ListService {

    static getList(listName) {
        return new Promise((resolve, reject) => {
            axios.get(API_URL + listName)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
} 