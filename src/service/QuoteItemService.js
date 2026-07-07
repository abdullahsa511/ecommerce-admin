import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/quotes';
const API_URL_ACCEPT_QUOTE = import.meta.env.VITE_API_BASE_URL + '/quote-acceptance';
const API_URL_PRODUCT_LIST = import.meta.env.VITE_API_BASE_URL + '/items-product-list';
const API_URL_RELATED_SEARCH = import.meta.env.VITE_API_BASE_URL + '/products-related-search';

// Static Quote Items array based on QuoteItem model
const STATIC_QUOTE_ITEMS = [
    {
        quote_item_id: 1,
        language_id: 1,
        uuid: '550e8400-e29b-41d4-a716-446655440001',
        quote_id: 1,
        product_id: 101,
        description: 'Premium Office Chair - Ergonomic Design',
        quantity: 2,
        unit_price: 299.99,
        total_price: 599.98,
        photo: 'office-chair-premium.jpg',
        sort_order: 1,
        created_at: '2024-01-15 10:30:00',
        updated_at: '2024-01-15 10:30:00'
    },
    {
        quote_item_id: 2,
        language_id: 1,
        uuid: '550e8400-e29b-41d4-a716-446655440002',
        quote_id: 1,
        product_id: 102,
        description: 'Standing Desk - Adjustable Height',
        quantity: 1,
        unit_price: 549.99,
        total_price: 549.99,
        photo: 'standing-desk-adjustable.jpg',
        sort_order: 2,
        created_at: '2024-01-15 10:35:00',
        updated_at: '2024-01-15 10:35:00'
    },
    {
        quote_item_id: 3,
        language_id: 1,
        uuid: '550e8400-e29b-41d4-a716-446655440003',
        quote_id: 1,
        product_id: null,
        description: 'Custom Installation Service',
        quantity: 1,
        unit_price: 150.00,
        total_price: 150.00,
        photo: 'default-photo.jpg',
        sort_order: 3,
        created_at: '2024-01-15 10:40:00',
        updated_at: '2024-01-15 10:40:00'
    },
    {
        quote_item_id: 4,
        language_id: 1,
        uuid: '550e8400-e29b-41d4-a716-446655440004',
        quote_id: 2,
        product_id: 201,
        description: 'Wireless Keyboard and Mouse Combo',
        quantity: 5,
        unit_price: 79.99,
        total_price: 399.95,
        photo: 'keyboard-mouse-combo.jpg',
        sort_order: 1,
        created_at: '2024-01-16 09:15:00',
        updated_at: '2024-01-16 09:15:00'
    },
    {
        quote_item_id: 5,
        language_id: 1,
        uuid: '550e8400-e29b-41d4-a716-446655440005',
        quote_id: 2,
        product_id: 202,
        description: '27-inch 4K Monitor',
        quantity: 3,
        unit_price: 399.99,
        total_price: 1199.97,
        photo: 'monitor-4k-27inch.jpg',
        sort_order: 2,
        created_at: '2024-01-16 09:20:00',
        updated_at: '2024-01-16 09:20:00'
    },
    {
        quote_item_id: 6,
        language_id: 1,
        uuid: '550e8400-e29b-41d4-a716-446655440006',
        quote_id: 3,
        product_id: 301,
        description: 'Conference Table - 8 Person',
        quantity: 1,
        unit_price: 1299.99,
        total_price: 1299.99,
        photo: 'conference-table-8person.jpg',
        sort_order: 1,
        created_at: '2024-01-17 14:00:00',
        updated_at: '2024-01-17 14:00:00'
    },
    {
        quote_item_id: 7,
        language_id: 1,
        uuid: '550e8400-e29b-41d4-a716-446655440007',
        quote_id: 3,
        product_id: null,
        description: 'Delivery and Setup Fee',
        quantity: 1,
        unit_price: 200.00,
        total_price: 200.00,
        photo: 'default-photo.jpg',
        sort_order: 2,
        created_at: '2024-01-17 14:05:00',
        updated_at: '2024-01-17 14:05:00'
    }
];

export default class QuoteItemService {
    // Get all quote items
    static getQuoteItems() {
        // Return static array instead of API call
        return new Promise((resolve) => {
            resolve(STATIC_QUOTE_ITEMS);
        });

        // Original API call code (commented out)
        // return new Promise((resolve, reject) => {
        //     axios.get(`${API_URL}/items`)
        //         .then(response => {
        //             resolve(response.data);
        //         })
        //         .catch(error => {
        //             console.error('Error fetching quote items:', error);
        //             reject(error);
        //         });
        // });
    }

    // Get a single quote item by ID
    static getQuoteItemById(quoteItemId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/items/${quoteItemId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching quote item:', error);
                    reject(error);
                });
        });
    }

    // Create a new quote item
    static createQuoteItem(newQuoteItem) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/add-items`, {quoteItem: newQuoteItem}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error creating quote item:', error);
                reject(error);
            });
        });
    }

    // Update an existing quote item
    static updateQuoteItem(updatedQuoteItem) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/items/${updatedQuoteItem.quoteItem_id}`, {quoteItem: updatedQuoteItem}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error updating quote item:', error);
                reject(error);
            });
        });
    }

    // Delete a quote item
    static deleteQuoteItem(quoteItemId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/items/${quoteItemId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error deleting quote item:', error);
                reject(error);
            });
        });
    }

    // Get product list
    static getProductList(query) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL_PRODUCT_LIST, 
                { search: query },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error searching products:', error);
                reject(error);
            });
        });
    }

    static searchQuoteItems(query) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL_RELATED_SEARCH, 
                { search: query },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error searching products:', error);
                reject(error);
            });
        });
    }

    static showQuoteItems(quoteId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${quoteId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error showing quote items:', error);
                reject(error);
            });
        });
    }

    static acceptQuote(quoteId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL_ACCEPT_QUOTE}?quote_id=${quoteId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error accepting quote:', error);
                reject(error);
            });
        });
    }
}
