<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useRegionStore } from '@/stores/region';
import { useCountryStore } from '@/stores/country';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import Region from '@/models/Region';

const toast = useToast();
const route = useRoute();
const router = useRouter();
const regionStore = useRegionStore();
const countryStore = useCountryStore();
const { regions, fb } = storeToRefs(regionStore);
const { countries } = storeToRefs(countryStore);

const regionId = route.params.id;
const region = ref(new Region());

const isLoading = computed(() => {
    return fb.value.loading === true;
});

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
    try {
        await countryStore.fetchCountries();
        const fetchedRegion = await regionStore.fetchRegionById(regionId);
        region.value = new Region(fetchedRegion);
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load region details. Please try again.',
            life: 3000
        });
        goToRegionList();
    }
});

const goToRegionList = () => {
    router.push('/configuration/settings/regions');
};

const updateRegion = async () => {
    try {
        await regionStore.updateRegion(regionId, region.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Region updated successfully',
            life: 3000
        });
        goToRegionList();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update region. Please try again.',
            life: 3000
        });
    }
};
</script>

<template>
    <div class="flex justify-end gap-2 mb-6">
        <Button 
            icon="pi pi-arrow-left"
            label="Region List"
            severity="secondary"
            @click="goToRegionList"
            class="p-button-md"
        />
        <Button 
            icon="pi pi-save"
            label="Save"
            severity="primary"
            @click="updateRegion"
            class="p-button-md"
        />
    </div>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20 border-t pt-6">
        <div class="w-full mt-3">
            <div class="flex flex-col gap-6">
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText 
                            class="text-lg w-full" 
                            id="name" 
                            type="text" 
                            v-model="region.name" 
                            placeholder="Name" 
                        />
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
                        />
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
    <Fluid v-if="region.country_id" class="border-t pt-6">
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