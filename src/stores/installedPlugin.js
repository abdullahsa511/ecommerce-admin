import { defineStore } from 'pinia';
import { InstalledPluginService } from '../service/InstalledPluginService';
import { InstalledPluginFilter } from '../filters/InstalledPluginFilter';

export const useInstalledPluginStore = defineStore('installedPlugin', {
    state: () => ({
        plugins: [],
        filter: new InstalledPluginFilter(),
        loading: false,
        error: null,
        selectedCategory: 'All'
    }),

    getters: {
        filteredPlugins: (state) => {
            let filtered = state.plugins;
            
            // Apply category filter
            if (state.selectedCategory !== 'All') {
                filtered = filtered.filter(plugin => plugin.category === state.selectedCategory);
            }
            
            // Apply other filters
            return filtered.filter(plugin => state.filter.matches(plugin));
        },

        categories: (state) => {
            const categories = ['All', ...new Set(state.plugins.map(plugin => plugin.category))];
            return categories;
        }
    },

    actions: {
        async fetchPlugins() {
            this.loading = true;
            this.error = null;
            try {
                this.plugins = await InstalledPluginService.getAll();
            } catch (error) {
                this.error = 'Failed to fetch plugins';
                console.error('Error fetching plugins:', error);
            } finally {
                this.loading = false;
            }
        },

        setFilter(filterData) {
            Object.assign(this.filter, filterData);
        },

        setCategory(category) {
            this.selectedCategory = category;
        },

        async togglePluginStatus(pluginId) {
            try {
                const success = await InstalledPluginService.toggleStatus(pluginId);
                if (success) {
                    const plugin = this.plugins.find(p => p.plugin_id === pluginId);
                    if (plugin) {
                        plugin.status = plugin.status === 'Active' ? 'Inactive' : 'Active';
                    }
                }
                return success;
            } catch (error) {
                console.error('Error toggling plugin status:', error);
                return false;
            }
        }
    }
}); 