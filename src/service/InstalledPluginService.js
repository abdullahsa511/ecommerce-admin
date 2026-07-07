import { InstalledPlugin } from '@/models/InstalledPlugin';

export class InstalledPluginService {
    static baseUrl = '/data/installedPlugins.json';

    static async getAll() {
        try {
            const response = await fetch(this.baseUrl);
            const data = await response.json();
            return data.map(plugin => InstalledPlugin.fromJSON(plugin));
        } catch (error) {
            console.error('Error fetching installed plugins:', error);
            return [];
        }
    }

    static async getById(pluginId) {
        try {
            const response = await fetch(this.baseUrl);
            const data = await response.json();
            const plugin = data.find(p => p.plugin_id === pluginId);
            return plugin ? InstalledPlugin.fromJSON(plugin) : null;
        } catch (error) {
            console.error(`Error fetching plugin with ID ${pluginId}:`, error);
            return null;
        }
    }

    static async toggleStatus(pluginId) {
        try {
            // This would be an API call in a real application
            console.log(`Toggle status for plugin ${pluginId}`);
            return true;
        } catch (error) {
            console.error(`Error toggling plugin status: ${error}`);
            return false;
        }
    }
} 