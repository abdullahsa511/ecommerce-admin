<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const breadcrumbRoutes = ref([]);

const setBreadcrumbRoutes = () => {
    if (route.meta.breadcrumb) {
        breadcrumbRoutes.value = route.meta.breadcrumb;

        return;
    }

    breadcrumbRoutes.value = route.fullPath
        .split('/')
        .filter((item) => item !== '')
        .filter((item) => isNaN(Number(item)))
        .map((item) => item.charAt(0).toUpperCase() + item.slice(1));
};

watch(
    route,
    () => {
        setBreadcrumbRoutes();
    },
    { immediate: true }
);
</script>

<template>
    <nav class="layout-breadcrumb hidden sm:block"> 
        <ol>
            <template v-for="(breadcrumbRoute, i) in breadcrumbRoutes" :key="breadcrumbRoute">
                <li class="text-surface-950 dark:text-surface-0 title-h7 text-xl">{{ breadcrumbRoute }}</li>
                <li v-if="i !== breadcrumbRoutes.length - 1" class="layout-breadcrumb-chevron">/</li>
            </template>
        </ol>
    </nav>

    <nav class="flex items-center py-3 px-4 sm:hidden bg-white dark:bg-surface-800">
        <ol class="flex items-center space-x-2 text-gray-700 dark:text-gray-100">
            <template v-for="(breadcrumbRoute, i) in breadcrumbRoutes" :key="breadcrumbRoute">
                <li class="capitalize font-semibold text-base" :class="{'text-gray-900 dark:text-white': i === breadcrumbRoutes.length - 1}">
                    {{ breadcrumbRoute }}
                </li>
                <li v-if="i !== breadcrumbRoutes.length - 1" class="text-gray-400 dark:text-gray-600 select-none">/</li>
            </template>
        </ol>
    </nav>
</template>
