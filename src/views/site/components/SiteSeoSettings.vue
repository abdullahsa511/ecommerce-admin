<script setup lang="ts">
import { PropType, computed } from 'vue';
import Site from '@/models/Site';
import { useRoute } from 'vue-router';

const route = useRoute();
const props = defineProps({
  site: {
    type: Site,
    required: true,
    default: () => new Site()
  },
  fb: {
    type: Object as PropType<any>,
    required: false,
    default: () => ({})
  }
});

const siteId = computed(() => {
    const routeId = route.params.id;
    const normalizedRouteId = Array.isArray(routeId) ? routeId[0] : routeId;
    return props.site.site_id ?? normalizedRouteId ?? '';
});

</script>
<template>
 <!-- Seo Tab -->
 <div class="flex flex-col gap-6">
    <div class="loading-overlay" v-if="siteId && props.fb?.loading?.['site.edit.' + siteId] || props.fb?.loading?.['site.create']">
        <div class="flex justify-center items-center h-full spinner">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
            <p class="mt-2">Loading site data. Please wait.</p>
        </div>
    </div>
    <!-- Language selector -->
    <div class="flex justify-end">
        <Button label="English" icon="pi pi-globe" class="p-button-text" />
    </div>


    <!-- Open Graph Section -->
    <div class="space-y-6">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Open Graph</h3>
        
        <!-- Open Graph Title -->
        <div class="grid grid-cols-12 gap-2">
            <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Open Graph Title</label>
            <div class="col-span-12 md:col-span-9">
                <InputText v-model="site.seoSettings.open_graph_title" class="w-full" />
            </div>
        </div>

        <!-- Open Graph Description -->
        <div class="grid grid-cols-12 gap-2">
            <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Open Graph Description</label>
            <div class="col-span-12 md:col-span-9">
                <Textarea v-model="site.seoSettings.open_graph_description" rows="3" class="w-full" />
            </div>
        </div>
    </div>

    <!-- Twitter Section -->
    <div class="space-y-6">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Twitter</h3>
        
        <!-- Twitter Title -->
        <div class="grid grid-cols-12 gap-2">
            <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Twitter Title</label>
            <div class="col-span-12 md:col-span-9">
                <InputText v-model="site.seoSettings.twitter_title" class="w-full" />
            </div>
        </div>

        <!-- Twitter Description -->
        <div class="grid grid-cols-12 gap-2">
            <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Twitter Description</label>
            <div class="col-span-12 md:col-span-9">
                <Textarea v-model="site.seoSettings.twitter_description" rows="3" class="w-full" />
            </div>
        </div>

        <!-- Twitter Label 1 -->
        <div class="grid grid-cols-12 gap-2">
            <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Twitter label 1</label>
            <div class="col-span-12 md:col-span-9">
                <InputText v-model="site.seoSettings.twitter_label_1" class="w-full" />
            </div>
        </div>

        <!-- Twitter Data 1 -->
        <div class="grid grid-cols-12 gap-2">
            <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Twitter data 1</label>
            <div class="col-span-12 md:col-span-9">
                <InputText v-model="site.seoSettings.twitter_data_1" class="w-full" />
            </div>
        </div>

        <!-- Twitter Label 2 -->
        <div class="grid grid-cols-12 gap-2">
            <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Twitter label 2</label>
            <div class="col-span-12 md:col-span-9">
                <InputText v-model="site.seoSettings.twitter_label_2" class="w-full" />
            </div>
        </div>

        <!-- Twitter Data 2 -->
        <div class="grid grid-cols-12 gap-2">
            <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Twitter data 21</label>
            <div class="col-span-12 md:col-span-9">
                <InputText v-model="site.seoSettings.twitter_data_2" class="w-full" />
            </div>
        </div>
    </div>
</div> 
</template>