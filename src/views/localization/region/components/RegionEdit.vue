<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useRegionStore } from '@/stores/region';
import { useCountryStore } from '@/stores/country';
import { storeToRefs } from 'pinia';

const emit = defineEmits(['update:region', 'saved', 'editTabUnmunted', 'editTabMounted']);
// Accept optional `id` prop (parent may pass region id). Prefer prop when provided, else use route param.
const props = defineProps({
    id: {
    type: [String, Number],
    default: undefined,
    },
});
const route = useRoute();
const regionStore = useRegionStore();
const countryStore = useCountryStore();
const { fb, region, regions } = storeToRefs(regionStore);
const { countries } = storeToRefs(countryStore);

const regionId = route.params.id;

const statusOptions = ref([
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 },
]);

const countryOptions = computed(() => {
    return countries.value.map(country => ({
        name: country.name,
        code: country.country_id
    }));
});

const filteredRegions = computed(() => {
    if (!region.value.country_id) return [];
    return regions.value.filter(r => r.country_id === region.value.country_id);
});

onMounted(async () => {
    emit('editTabMounted');

    // prefer prop id when provided, otherwise fall back to route param
    const idToFetch = props.id ?? regionId;

    // ensure countries are loaded first, then fetch the region (if we have an id)
    await countryStore.fetchCountries();
    if (idToFetch) {
        await regionStore.fetchRegionById(idToFetch);
    } else if (typeof regionStore.resetRegion === 'function') {
        // ensure store has a fresh region object for editing when no id supplied
        regionStore.resetRegion();
    }
});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-full mt-3">
            <div class="flex flex-col gap-6">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit Region</h3>
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText 
                            class="text-lg w-full" 
                            id="name" 
                            type="text" 
                            v-model="region.name" 
                            placeholder="Name"
                            :class="{ 'p-invalid': fb.errors['region.update.' + regionId]?.name }"
                        />
                        <Message v-if="fb.errors['region.update.' + regionId]?.name" severity="error" size="small" variant="title">
                        <span v-for="error in fb.errors['region.update.' + regionId]?.name" :key="error" class="flex flex-col">
                            {{ error }}
                        </span>
                    </Message>
                    </div>
                    
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="code" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Region code</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText 
                            class="text-lg w-full" 
                            id="code" 
                            type="text" 
                            v-model="region.code" 
                            placeholder="code" 
                            :class="{ 'p-invalid': fb.errors['region.update.' + regionId]?.code }"
                        />
                        <Message v-if="fb.errors['region.update.' + regionId]?.code" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['region.update.' + regionId]?.code" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="country" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Country</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select 
                            class="text-lg w-full" 
                            v-model="region.country_id" 
                            :options="countryOptions" 
                            optionLabel="name"
                            optionValue="code"
                            placeholder="Select Country"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="status" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Status</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select 
                            class="text-lg w-full" 
                            v-model="region.status" 
                            :options="statusOptions" 
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Select Status"
                        />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>

    <!-- Regions List Section -->
    <!-- <Fluid v-if="region.country_id" class="border-t pt-6">
        <h2 class="text-xl font-semibold mb-4">Regions in Selected Country</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="r in filteredRegions" :key="r.region_id" 
                 class="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-lg font-medium">{{ r.name }}</h3>
                        <p class="text-gray-600">Code: {{ r.code }}</p>
                    </div>
                    <Tag :value="r.status === 1 ? 'Active' : 'Inactive'" 
                         :severity="r.status === 1 ? 'success' : 'danger'" />
                </div>
            </div>
        </div>
    </Fluid> -->
</template>