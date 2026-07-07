import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/instagram';
const PRODUCTS_API_URL = import.meta.env.VITE_API_BASE_URL + '/products';

class InstagramService {
    static searchHashtags(query) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/hashtags/search`, { params: { q: query } })
                .then(response => resolve(response.data))
                .catch(error => {
                    console.error('Error searching Instagram hashtags:', error);
                    reject(error);
                });
        });
    }

    static getHashtagPosts(hashtagId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/hashtags/${hashtagId}/posts`)
                .then(response => resolve(response.data))
                .catch(error => {
                    console.error('Error fetching Instagram hashtag posts:', error);
                    reject(error);
                });
        });
    }

    static getProductInstagramLinks(productId) {
        return new Promise((resolve, reject) => {
            axios.get(`${PRODUCTS_API_URL}/${productId}/instagram-links`)
                .then(response => resolve(response.data))
                .catch(error => {
                    console.error('Error fetching product Instagram links:', error);
                    reject(error);
                });
        });
    }

    // Full replace sync: links in the payload are saved; any existing links not included are deleted.
    static syncProductInstagramLinks(productId, links) {
        return new Promise((resolve, reject) => {
            axios.post(`${PRODUCTS_API_URL}/${productId}/instagram-links/sync`, { links }, {
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => resolve(response.data))
                .catch(error => {
                    console.error('Error syncing product Instagram links:', error);
                    reject(error);
                });
        });
    }

    static reorderProductInstagramLinks(productId, productInstagramIds) {
        return new Promise((resolve, reject) => {
            axios.post(`${PRODUCTS_API_URL}/${productId}/instagram-links/reorder`, {
                product_instagram_ids: productInstagramIds
            }, {
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => resolve(response.data))
                .catch(error => {
                    console.error('Error reordering product Instagram links:', error);
                    reject(error);
                });
        });
    }
}

export default InstagramService;
