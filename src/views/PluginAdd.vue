<script setup>
import { ref } from 'vue';

const plugins = ref([
    {
        id: 1,
        name: 'Tinymce plugins',
        icon: 'pi pi-file-edit',
        description: 'Tinymce plugins to extend tinymce text editor functionality, included plugins: bootstrap gridPlugin repository',
        repository: 'https://github.com/Vvveb/tinymce-plugins',
        lastUpdated: '3 months ago',
        installed: true
    },
    {
        id: 2,
        name: 'Editor.js',
        icon: 'pi pi-plus',
        description: 'Replace default tinymce editor from post and product edit page with Editor.jsPlugin repository',
        repository: 'https://github.com/Vvveb/editor-js',
        lastUpdated: '3 months ago',
        installed: true
    },
    {
        id: 3,
        name: 'Transliterate',
        icon: 'pi pi-language',
        description: 'Transliterate post and products slugs and urls from cyrillic, greek etc to latinPlugin repository',
        repository: 'https://github.com/Vvveb/transliterate',
        lastUpdated: '3 months ago',
        installed: true
    },
    {
        id: 4,
        name: 'File manager',
        icon: 'pi pi-folder',
        description: 'Manage all files from inside Vvveb folder. Supported operations edit, rename, upload, download, zip, unzip etc',
        repository: 'https://github.com/Vvveb/file-manager',
        lastUpdated: '3 months ago',
        installed: false
    },
    {
        id: 5,
        name: 'GraphQL',
        icon: 'pi pi-share-alt',
        description: 'View and interact with GraphQL APIPlugin repository',
        repository: 'https://github.com/Vvveb/graphql',
        lastUpdated: '4 months ago',
        installed: true
    },
    {
        id: 6,
        name: 'Openapi',
        icon: 'pi pi-database',
        description: 'View and interact with REST APIPlugin repository',
        repository: 'https://github.com/Vvveb/openapi',
        lastUpdated: '4 months ago',
        installed: true
    }
]);

const viewDetails = (plugin) => {
    console.log('View details for:', plugin.name);
};

const toggleInstall = (plugin) => {
    plugin.installed = !plugin.installed;
    console.log(plugin.installed ? 'Installing' : 'Uninstalling', plugin.name);
};
</script>

<template>
    <div class="container mx-auto pt-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Plugin Card -->
            <div v-for="plugin in plugins" :key="plugin.id" class="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col min-h-[270px]">
                <!-- Card Body -->
                <div class="p-6 flex items-start gap-8 flex-grow">
                    <!-- Left side - Icon -->
                    <div class="text-gray-600 min-w-[120px] flex items-center justify-center">
                        <i :class="[plugin.icon, 'plugin-icon']"></i>
                    </div>
                    <!-- Right side - Content -->
                    <div class="flex-1">
                        <h3 class="text-blue-500 text-xl font-medium mb-2">{{ plugin.name }}</h3>
                        <p class="text-gray-600 text-xl leading-relaxed">{{ plugin.description }}</p>
                        <a :href="plugin.repository" class="text-gray-500 text-base hover:text-blue-500 mt-1 block">
                            {{ plugin.repository }}
                        </a>
                    </div>
                </div>

                <!-- Card Footer -->
                <div class="px-6 py-2 bg-gray-50 rounded-b-lg mt-auto border-t border-gray-200">
                    <div class="flex items-center justify-between">
                        <div class="text-base leading-snug">
                            <div>
                                <span class="font-semibold text-gray-700">Last Updated: </span>
                                <span class="text-gray-600">{{ plugin.lastUpdated }}</span>
                            </div>
                            <div>
                                <span class="font-semibold text-gray-700">Compatible </span>
                                <span class="text-gray-600">with your version of Vvveb</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <Button
                                label="Plugin details"
                                class="p-button-text !text-primary hover:!bg-primary hover:!text-white text-base !py-1 whitespace-nowrap"
                                @click="viewDetails(plugin)"
                            />
                            <Button
                                :label="plugin.installed ? 'Installed' : 'Install'"
                                :icon="plugin.installed ? 'pi pi-check' : 'pi pi-download'"
                                :class="[
                                    'text-base !py-1 whitespace-nowrap',
                                    plugin.installed ? 'p-button-secondary bg-secondary-300 pointer-events-none' : 'p-button-primary'
                                ]"
                                @click="toggleInstall(plugin)"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    max-width: 1400px;
}

:deep(.p-button) {
    border-radius: 0.5rem;
    font-size: 1rem;
    padding: 0.5rem 0.75rem;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
}

:deep(.p-button .p-button-icon) {
    margin-right: 0.5rem;
}

:deep(.p-button-text) {
    color: var(--primary-color);
}

:deep(.p-button-text:hover) {
    color: white !important;
    background-color: var(--primary-color) !important;
}

:deep(.p-button-secondary.bg-secondary-100) {
    background-color: var(--secondary-100) !important;
    color: var(--secondary-700) !important;
    border-color: var(--secondary-100) !important;
}

:deep(.p-button-primary) {
    background-color: var(--primary-color) !important;
    border-color: var(--primary-color) !important;
    color: white !important;
}

/* Increase icon sizes */
.plugin-icon {
    font-size: 8rem;
}

/* Card hover effects */
.bg-white {
    transition: all 0.2s ease-in-out;
    display: flex;
    flex-direction: column;
}

.bg-white:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style> 