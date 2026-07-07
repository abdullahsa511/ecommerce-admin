import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import MenuService from '../service/MenuService';
import MenuFilter from '../filters/MenuFilter';

export const useMenuStore = defineStore('menu', () => {
    const menus = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const filter = ref(new MenuFilter());

    const filteredMenus = computed(() => {
        return menus.value.filter(menu => filter.value.matches(menu));
    });

    const fetchMenus = async () => {
        loading.value = true;
        error.value = null;
        try {
            menus.value = await MenuService.getAll();
        } catch (err) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    };

    const getMenuById = async (id) => {
        loading.value = true;
        error.value = null;
        try {
            return await MenuService.getById(id);
        } catch (err) {
            error.value = err.message;
            return null;
        } finally {
            loading.value = false;
        }
    };

    const addMenu = async (menu) => {
        loading.value = true;
        error.value = null;
        try {
            const newMenu = await MenuService.create(menu);
            menus.value.push(newMenu);
            return newMenu;
        } catch (err) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const updateMenu = async (menu) => {
        loading.value = true;
        error.value = null;
        try {
            const updatedMenu = await MenuService.update(menu);
            const index = menus.value.findIndex(m => m.menu_id === menu.menu_id);
            if (index !== -1) {
                menus.value[index] = updatedMenu;
            }
            return updatedMenu;
        } catch (err) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const deleteMenu = async (id) => {
        loading.value = true;
        error.value = null;
        try {
            const success = await MenuService.delete(id);
            if (success) {
                menus.value = menus.value.filter(menu => menu.menu_id !== id);
            }
            return success;
        } catch (err) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const searchMenus = async (query) => {
        loading.value = true;
        error.value = null;
        try {
            filter.value.name = query;
            await fetchMenus();
        } catch (err) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    };

    const setFilter = (newFilter) => {
        filter.value = newFilter;
    };

    const clearFilter = () => {
        filter.value = new MenuFilter();
    };

    return {
        menus,
        loading,
        error,
        filteredMenus,
        filter,
        fetchMenus,
        getMenuById,
        addMenu,
        updateMenu,
        deleteMenu,
        searchMenus,
        setFilter,
        clearFilter
    };
}); 