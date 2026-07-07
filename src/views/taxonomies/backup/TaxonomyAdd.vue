<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePostTypeStore } from '../stores/postType';
import { useSiteStore } from '../stores/site';
import { useTaxonomyStore } from '../stores/taxonomy';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import Taxonomy from '@/models/Taxonomy';

const router = useRouter();
const toast = useToast();
const newTaxonomy = ref(new Taxonomy());
const taxonomyStore = useTaxonomyStore();
const postTypeStore = usePostTypeStore();
const siteStore = useSiteStore();
const { taxonomies, fb } = storeToRefs(taxonomyStore);

const isLoading = computed(() => {
    return fb.value.loading === true;
});

const typeOptions = ref([
    { name: 'Categories', code: 'categories' },
    { name: 'Tags', code: 'tags' },
]);


// Convert post types to dropdown format
// const postTypeOptions = computed(() => {
//     return postTypeStore.postTypes.map(pt => ({
//         name: pt.name,
//         code: pt.post_type_id
//     }));
// });
const postTypeOptions = computed(() => {
    return postTypeStore.postTypes.map(pt => ({ name: pt.name, code: pt.post_type_id }));
});

// Convert sites to dropdown format
const siteOptions = computed(() => {
    return siteStore.sites.map(site => ({
        name: site.name,
        code: site.site_id
    }));
});

onMounted(async () => {
    await Promise.all([
        postTypeStore.fetchPostTypes(),
        siteStore.fetchSites(),
        taxonomyStore.fetchTaxonomies()
    ]);
    
    // Set default values after data is loaded
    newTaxonomy.value.post_type = postTypeOptions.value[0];
    newTaxonomy.value.site = siteOptions.value[0];
});

const goToTaxonomyList = () => {
    router.push('/configuration/settings/taxonomies');
};

const saveTaxonomy = async () => {
    try {
        const payload = {
            ...newTaxonomy.value,
            post_type: newTaxonomy.value.post_type.name,
            site_id: newTaxonomy.value.site.code
        };
        await taxonomyStore.createTaxonomy(payload);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Taxonomy created successfully',
            life: 3000
        });
        goToTaxonomyList();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create taxonomy. Please try again.',
            life: 3000
        });
    }
};

</script>

<template>
    <div class="flex justify-end gap-2 mb-6">
        <Button 
            icon="pi pi-arrow-left"
            label="Taxonomy List"
            severity="secondary"
            @click="goToTaxonomyList"
            class="p-button-md"
        />
        <Button 
            icon="pi pi-save"
            label="Save"
            severity="primary"
            @click="saveTaxonomy"
            class="p-button-md"
        />
    </div>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-full">
            <div class="flex flex-col gap-6">
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg" id="name" type="text" v-model="newTaxonomy.name" placeholder="Name" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="type" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Type</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select class="text-lg" v-model="newTaxonomy.type" :options="typeOptions" optionLabel="name" optionValue="code" placeholder="Select Type" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="post_type" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Post Type</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select class="text-lg" v-model="newTaxonomy.post_type" :options="postTypeOptions" optionLabel="name" placeholder="Select Post Type" :loading="postTypeStore.loading" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="site_id" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Site</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select class="text-lg" v-model="newTaxonomy.site" :options="siteOptions" optionLabel="name" placeholder="Select Site" :loading="siteStore.loading" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<style scoped>
label {
    font-size: 1.2rem;
}
:deep(input::placeholder),
:deep(textarea::placeholder) {
    color: #767779 !important;
    opacity: 1;
    font-size: 1.2rem;
}
</style>
