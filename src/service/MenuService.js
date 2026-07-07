import Menu from '../models/Menu';

export default class MenuService {
    static baseUrl = '/data/menus.json';

    static async getAll() {
        try {
            const response = await fetch(this.baseUrl);
            const data = await response.json();
            return data.map(menu => Menu.fromJSON(menu));
        } catch (error) {
            console.error('Error fetching menus:', error);
            return [];
        }
    }

    static async getById(id) {
        try {
            const response = await fetch(this.baseUrl);
            const data = await response.json();
            const menu = data.find(m => m.menu_id === id);
            return menu ? Menu.fromJSON(menu) : null;
        } catch (error) {
            console.error('Error fetching menu:', error);
            return null;
        }
    }

    static async create(menu) {
        // TODO: Implement API call
        console.log('Creating menu:', menu);
        return menu;
    }

    static async update(menu) {
        // TODO: Implement API call
        console.log('Updating menu:', menu);
        return menu;
    }

    static async delete(id) {
        // TODO: Implement API call
        console.log('Deleting menu:', id);
        return true;
    }
} 