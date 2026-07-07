import axios from 'axios';
import Return from '../models/Return';

export default class ReturnService {
    static async fetchReturns() {
        try {
            const response = await axios.get('/data/returns.json');
            return response.data.map(returnItem => Return.fromJSON(returnItem));
        } catch (error) {
            console.error('Error fetching returns:', error);
            throw error;
        }
    }

    static async getReturnById(id) {
        try {
            const response = await axios.get('/data/returns.json');
            const returnItem = response.data.find(r => r.return_id === id);
            return returnItem ? Return.fromJSON(returnItem) : null;
        } catch (error) {
            console.error('Error fetching return:', error);
            throw error;
        }
    }

    static async addReturn(returnItem) {
        try {
            const newReturn = {
                ...returnItem,
                return_id: Date.now().toString(),
                date_added: new Date().toISOString(),
                date_updated: new Date().toISOString()
            };
            return Return.fromJSON(newReturn);
        } catch (error) {
            console.error('Error adding return:', error);
            throw error;
        }
    }

    static async updateReturn(returnItem) {
        try {
            const updatedReturn = {
                ...returnItem,
                date_updated: new Date().toISOString()
            };
            return Return.fromJSON(updatedReturn);
        } catch (error) {
            console.error('Error updating return:', error);
            throw error;
        }
    }

    static async deleteReturn(id) {
        try {
            // Simulate API call
            return true;
        } catch (error) {
            console.error('Error deleting return:', error);
            throw error;
        }
    }
} 