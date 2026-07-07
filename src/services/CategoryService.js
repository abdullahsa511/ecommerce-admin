import axios from 'axios';

export const CategoryService = {
    async getCategories() {
        const response = await axios.get('/data/category-static.json');
        return response.data;
    }
}; 