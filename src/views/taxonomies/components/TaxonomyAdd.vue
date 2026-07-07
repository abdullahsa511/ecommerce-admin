<script setup>
    import { ref,onMounted, computed, onUnmounted } from 'vue';
    import { useSiteStore } from '@/stores/site';
    import { useTaxonomyStore } from '@/stores/taxonomy';
    import { storeToRefs } from 'pinia';

    const emit = defineEmits(['update:newTaxonomy', 'saved', 'editTabUnmunted', 'editTabMounted']);
    const taxonomyStore = useTaxonomyStore();
    const siteStore = useSiteStore();
    const { newTaxonomy, modelTypes, taxonomyTypes, fb } = storeToRefs(taxonomyStore);
    
    // Convert sites to dropdown format
    const siteOptions = computed(() => {
        return siteStore.sites.map(site => ({
            name: site.name,
            code: site.site_id
        }));
    });
    
    onMounted(async () => {
        emit('editTabMounted');
        await Promise.all([
            siteStore.fetchSites(),
            taxonomyStore.fetchTaxonomyTypes()
        ]);
        
        // Set default values after data is loaded
        newTaxonomy.value.post_type = modelTypes.value[0];
        newTaxonomy.value.site = siteOptions.value[0];
    });
    
    onUnmounted(() => {
        emit('editTabUnmunted');
    });

    </script>
    <template>
        <Fluid class="flex flex-col md:flex-row gap-8">
            <div class="w-full">
                <div class="flex flex-col gap-6">
                    <div class="grid grid-cols-12 gap-2">
                        <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText 
                                class="text-lg" 
                                id="name" type="text" 
                                v-model="newTaxonomy.name" 
                                placeholder="Name" 
                                :class="{ 'p-invalid': fb.errors['taxonomy.create']?.name }" 
                            />
                            <Message v-if="fb.errors['taxonomy.create']?.name" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors['taxonomy.create']?.name" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                        </div>
                    </div>
                    <div class="grid grid-cols-12 gap-2">
                        <label for="type" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Taxonomy Type</label>
                        <div class="col-span-12 md:col-span-10">
                            <Select 
                                class="text-lg" 
                                v-model="newTaxonomy.type" 
                                :options="taxonomyTypes" 
                                optionLabel="name" 
                                optionValue="code" 
                                placeholder="Select Type" 
                            />
                        </div>
                    </div>
                    <div class="grid grid-cols-12 gap-2">
                        <label for="post_type" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Model Type</label>
                        <div class="col-span-12 md:col-span-10">
                            <Select class="text-lg" v-model="newTaxonomy.post_type" :options="modelTypes" optionLabel="name" placeholder="Select Post Type"
                             :class="{ 'p-invalid': fb.errors['taxonomy.create']?.post_type }" />
                            <Message v-if="fb.errors['taxonomy.create']?.post_type" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors['taxonomy.create']?.post_type" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
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
