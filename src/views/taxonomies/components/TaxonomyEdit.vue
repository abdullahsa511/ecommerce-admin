<script setup>
    import { ref, onMounted, computed, onUnmounted } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { usePostTypeStore } from '@/stores/postType';
    import { useSiteStore } from '@/stores/site';
    import { useTaxonomyStore } from '@/stores/taxonomy';
    import { useToast } from 'primevue/usetoast';
    import { storeToRefs } from 'pinia';

    const emit = defineEmits(['update:newTaxonomy', 'saved', 'editTabUnmunted', 'editTabMounted']);
    const router = useRouter();
    const route = useRoute();
    const toast = useToast();
    const taxonomyStore = useTaxonomyStore();
    const postTypeStore = usePostTypeStore();
    const siteStore = useSiteStore();
    const { newTaxonomy, taxonomies, taxonomyTypes, modelTypes, fb } = storeToRefs(taxonomyStore);
    const taxonomyId = route.params.id;
    
    // const typeOptions = ref([
    //     { name: 'Categories', code: 'categories' },
    //     { name: 'Tags', code: 'tags' },
    // ]);
    
    // Taxonomy types
    // const postTypeOptions = computed(() => {
    //     return postTypeStore.postTypes.map(pt => ({ name: pt.name, code: pt.post_type_id }));
    // });
    
    // Convert sites to dropdown format
    const siteOptions = computed(() => {
        return siteStore.sites.map(site => ({
            name: site.name,
            code: site.site_id
        }));
    });
    
    onMounted(async () => {
        emit('editTabMounted');
        // await postTypeStore.fetchPostTypes();
        await siteStore.fetchSites();
        await taxonomyStore.fetchTaxonomyTypes();
        const fetchedTaxonomy = await taxonomyStore.fetchTaxonomyById(taxonomyId);
        newTaxonomy.value.post_type = modelTypes.value.find(mt => mt.name === fetchedTaxonomy.post_type);
        newTaxonomy.value.site = siteOptions.value.find(site => site.code === fetchedTaxonomy.site_id);
    });
    
    onUnmounted(() => {
        emit('editTabUnmunted');
    });

    </script>
    
    <template>
        <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
            <div class="w-full">
                <div class="flex flex-col gap-6">
                    <div class="grid grid-cols-12 gap-2">
                        <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText class="text-lg" id="name" type="text" v-model="newTaxonomy.name" placeholder="Name" 
                            :class="{'p-invalid': fb.errors?.['taxonomy.update.'+taxonomyId]?.name}" />
                            <Message v-if="fb.errors?.['taxonomy.update.'+taxonomyId]?.name" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors?.['taxonomy.update.'+taxonomyId]?.name" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                        </div>
                    </div>
                    <div class="grid grid-cols-12 gap-2">
                        <label for="type" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Taxonomy Type</label>
                        <div class="col-span-12 md:col-span-10">
                            <Select class="text-lg" 
                            v-model="newTaxonomy.type" 
                            :options="taxonomyTypes" 
                            optionLabel="name" 
                            optionValue="code" 
                            placeholder="Select Type" 
                            :class="{'p-invalid': fb.errors?.['taxonomy.update.'+taxonomyId]?.type}" />
                            <Message v-if="fb.errors?.['taxonomy.update.'+taxonomyId]?.type" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors?.['taxonomy.update.'+taxonomyId]?.type" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                        </div>
                    </div>
                    <div class="grid grid-cols-12 gap-2">
                        <label for="post_type" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Model Type</label>
                        <div class="col-span-12 md:col-span-10">
                            <Select class="text-lg" v-model="newTaxonomy.post_type" :options="modelTypes" optionLabel="name" placeholder="Select Model Type" 
                            :loading="postTypeStore.loading" :class="{'p-invalid': fb.errors?.['taxonomy.update.'+taxonomyId]?.post_type}" />
                            <Message v-if="fb.errors?.['taxonomy.update.'+taxonomyId]?.post_type" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors?.['taxonomy.update.'+taxonomyId]?.post_type" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                        </div>
                    </div>
                    <div class="grid grid-cols-12 gap-2">
                        <label for="site_id" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Site</label>
                        <div class="col-span-12 md:col-span-10">
                            <Select class="text-lg" v-model="newTaxonomy.site" :options="siteOptions" optionLabel="name" placeholder="Select Site" 
                            :loading="siteStore.loading" :class="{'p-invalid': fb.errors?.['taxonomy.update.'+taxonomyId]?.site}" />
                            <Message v-if="fb.errors?.['taxonomy.update.'+taxonomyId]?.site" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors?.['taxonomy.update.'+taxonomyId]?.site" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                        </div>
                    </div>
                </div>
            </div>
        </Fluid>
    </template>