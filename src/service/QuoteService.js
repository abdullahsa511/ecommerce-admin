import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/quotes';
const API_URL_IMPORT = (import.meta.env.VITE_API_BASE_URL || '') + '/import-quotes';

export default class QuoteService {
    // Get all quotes
    static getQuotes() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    // Get a single quote by ID
    static getQuoteById(quoteId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${quoteId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching post:', error);
                    reject(error);
                });
        });
    }

    // Create a new quote
    static createQuote(newQuote) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, { quote: newQuote }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating quote:', error);
                    reject(error);
                });
        });
    }

    // Update an existing quote
    static updateQuote(updatedQuote) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${updatedQuote.quote_id}`, { quote: updatedQuote }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error updating quote:', error);
                    reject(error);
                });
        });
    }

    // Delete a quote
    static deleteQuote(quoteId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${quoteId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting quote:', error);
                    reject(error);
                });
        });
    }

    static async importQuotes(fromData) {
        // alert('importVariants');
        try {
          const response = await axios.post(`${API_URL_IMPORT}`, fromData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          return response.data;
        } catch (error) {
          console.error('Error importing quotes:', error);
          throw error;
        }
      }
}

